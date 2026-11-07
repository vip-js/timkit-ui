import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { opened?: boolean; selected?: string[]; optionStatus?: string; api?: { value?: string[]; selectValue?: (value: string) => void } }
  methods?: Record<string, (event?: { mark?: { value?: string } }) => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void; detached?: () => void }
}

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'select.ts')).href)
  if (!captured) throw new Error('select was not registered')
  definitionCache = captured
  return definitionCache
}

const items = [
  { label: 'Pear', value: 'pear' },
  { label: 'Apple', value: 'apple', disabled: true },
]

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const host = {
    properties: { ...defaults, items, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    events: [] as Array<{ name: string; detail?: { value?: string[] } }>,
    triggerEvent(name: string, detail?: { value?: string[] }) {
      host.events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onTriggerTap: () => void
    onKey: (event?: { detail?: { key?: string } }) => void
    onItemTap: (event?: { mark?: { value?: string } }) => void
    onItemKey: (event?: { detail?: { key?: string }; mark?: { value?: string } }) => void
    onCloseKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string[] } }>
  }
}

describe('weapp select', () => {
  it('exposes a combobox and a listbox', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'select.wxml'), 'utf8')
    expect(markup).toContain('role="combobox"')
    expect(markup).toContain('aria-haspopup="listbox"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain("aria-required=\"{{required ? 'true' : 'false'}}\"")
    expect(markup).toContain('aria-label="{{ariaLabel || displayValue || placeholder}}"')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain('id="{{id}}-trigger"')
    expect(markup).toContain('aria-controls="{{id}}-listbox"')
    expect(markup).toContain('wx:elif="{{opened}}"')
    expect(markup.split('wx:else')[1].split('select-overlay')[0]).not.toContain('aria-controls')
    expect(markup).toContain('role="listbox" aria-labelledby="{{id}}-trigger" tabindex="0"')
    expect(markup).toContain('aria-labelledby="{{id}}-trigger"')
    expect(markup).toContain('role="option"')
    expect(markup).toContain('class="select-check" aria-hidden="true"')
    expect(markup).toContain('bindkeydown="onItemKey"')
    expect(markup).toContain('wx:if="{{opened && highlight >= 0}}"')
    expect(markup).toContain('aria-activedescendant="{{id}}-option-{{highlight}}"')
    expect(markup).not.toContain("aria-activedescendant=\"{{opened ? id + '-option-' + highlight : ''}}\"")
    expect(markup).toContain('role="button"')
    expect(markup).toContain('role="button" tabindex="0" aria-label="Close"')
    expect(markup).toContain('<text aria-hidden="true">×</text>')
    expect(markup).toContain('bindkeydown="onCloseKey"')
    expect(markup).toContain("aria-selected=\"{{selected.includes(item[itemValueKey] || item) ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="status"')
  })

  it('follows a later value and ignores taps while disabled', async () => {
    const host = await hostFor({ value: ['pear'] })
    expect(host.data.selected).toEqual(['pear'])
    expect(host.data.optionStatus).toBe('Option 1 of 2')
    expect(host.data.displayValue).toBe('Pear')
    host.setData({ value: [] })
    expect(host.data.selected).toEqual([])
    expect(host.data.optionStatus).toBe('')
    expect(host.data.displayValue).toBe('')

    const disabled = await hostFor({ disabled: true, value: ['pear'] })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.onItemTap({ mark: { value: 'apple' } })
    expect(disabled.data.selected).toEqual(['pear'])
    disabled.setData({ value: [] })
    expect(disabled.data.selected).toEqual([])
  })

  it('selects the default item and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: ['pear'] })
    expect(preset.data.selected).toEqual(['pear'])
    expect(preset.data.displayValue).toBe('Pear')

    const held = await hostFor({ value: [], defaultValue: ['pear'] })
    expect(held.data.selected).toEqual([])
    expect(held.data.displayValue).toBe('')
    held.onItemTap({ mark: { value: 'pear' } })
    expect(held.data.selected).toEqual([])
  })

  it('moves the highlighted option, selects it with Enter, and closes with Escape', async () => {
    const host = await hostFor()
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.opened).toBe(true)
    expect(host.data.highlight).toBe(0)
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.highlight).toBe(1)
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.selected ?? []).not.toContain('apple')
    expect(host.data.opened).toBe(true)
    host.onItemKey({ detail: { key: 'Enter' }, mark: { value: 'pear' } })
    expect(host.data.selected).toEqual(['pear'])
    expect(host.data.opened).toBe(false)

    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.opened).toBe(true)
    host.onCloseKey({ detail: { key: ' ' } })
    expect(host.data.opened).toBe(false)
    host.onKey({ detail: { key: 'ArrowDown' } })
    host.onKey({ detail: { key: 'Escape' } })
    expect(host.data.opened).toBe(false)
  })

  it('opens with the shared ArrowDown key and stays shut while disabled', async () => {
    const enabled = await hostFor()
    enabled.onKey({ detail: { key: 'ArrowDown' } })
    expect(enabled.data.opened).toBe(true)

    const disabled = await hostFor({ disabled: true })
    disabled.onKey({ detail: { key: 'ArrowDown' } })
    expect(disabled.data.opened).toBe(false)
  })

  it('opens, selects an item, and ignores a disabled item or a disabled field', async () => {
    const held = await hostFor({ value: [] })
    held.onTriggerTap()
    held.onItemTap({ mark: { value: 'pear' } })
    expect(held.data.selected).toEqual([])
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: ['pear'] } })
    held.setProperty('value', ['pear'])
    expect(held.data.selected).toEqual(['pear'])
    expect(held.data.displayValue).toBe('Pear')

    const enabled = await hostFor()
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(true)
    enabled.onItemTap({ mark: { value: 'pear' } })
    expect(enabled.data.selected).toEqual(['pear'])
    expect(enabled.data.displayValue).toBe('Pear')
    enabled.onItemTap({ mark: { value: 'apple' } })
    expect(enabled.data.selected).toEqual(['pear'])

    const disabled = await hostFor({ disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.onItemTap({ mark: { value: 'pear' } })
    expect(disabled.data.selected ?? []).not.toContain('pear')
  })

  it('opens from defaultOpen and follows a later open value', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.opened).toBe(true)

    const held = await hostFor({ open: false, defaultOpen: true })
    expect(held.data.opened).toBe(false)
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
    held.setProperty('open', true)
    expect(held.data.opened).toBe(true)
    held.onBackdropTap()
    expect(held.data.opened).toBe(true)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: false } })
    held.setProperty('open', null)
    expect(held.data.opened).toBe(true)
  })

  it('ignores opening and selection while read-only and still follows a later value', async () => {
    const frozen = await hostFor({ readOnly: true, value: 'apple' })
    expect(frozen.data.selected).toEqual(['apple'])
    frozen.onTriggerTap()
    frozen.onItemTap({ mark: { value: 'pear' } })
    frozen.onKey({ detail: { key: 'ArrowDown' } })
    expect(frozen.data.opened).toBe(false)
    expect(frozen.data.selected).toEqual(['apple'])
    expect(frozen.events).toEqual([])
    frozen.setProperty('value', 'pear')
    expect(frozen.data.selected).toEqual(['pear'])
  })

  it('uses a passed accessible name and leaves an omitted name empty', async () => {
    const named = await hostFor({ 'aria-label': 'Fruit' })
    expect(named.data.ariaLabel).toBe('Fruit')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    plain.setProperty('aria-label', 'Size')
    expect(plain.data.ariaLabel).toBe('Size')
  })

  it('jumps to the first and last enabled option with Home and End', async () => {
    const host = await hostFor({
      items: [
        { label: 'Pear', value: 'pear' },
        { label: 'Apple', value: 'apple', disabled: true },
        { label: 'Plum', value: 'plum' },
      ],
    })
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.opened).toBe(false)
    expect(host.data.selected).toEqual(['pear'])
    host.onKey({ detail: { key: 'ArrowDown' } })
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.highlight).toBe(2)
    expect(host.data.selected).toEqual(['pear'])
    expect(host.data.opened).toBe(true)
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.highlight).toBe(0)
    expect(host.data.selected).toEqual(['pear'])

    const closed = await hostFor({
      items: [
        { label: 'Apple', value: 'apple', disabled: true },
        { label: 'Pear', value: 'pear' },
        { label: 'Plum', value: 'plum' },
      ],
    })
    closed.onKey({ detail: { key: 'End' } })
    expect(closed.data.opened).toBe(false)
    expect(closed.data.selected).toEqual(['plum'])

    const frozen = await hostFor({
      items: [{ label: 'Pear', value: 'pear' }],
      readOnly: true,
    })
    frozen.onKey({ detail: { key: 'End' } })
    expect(frozen.data.selected ?? []).toEqual([])
    expect(frozen.data.opened).toBe(false)
  })

  it('moves to the next matching option with a letter and selects it only while closed', async () => {
    const fruit = [
      { label: 'Pear', value: 'pear' },
      { label: 'Apple', value: 'apple', disabled: true },
      { label: 'Plum', value: 'plum' },
      { label: 'Peach', value: 'peach' },
    ]
    const host = await hostFor({ items: fruit })
    host.onTriggerTap()
    expect(host.data.opened).toBe(true)
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(0)
    expect(host.data.selected ?? []).toEqual([])
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(2)
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(3)
    host.onKey({ detail: { key: 'z' } })
    expect(host.data.highlight).toBe(3)
    expect(host.data.opened).toBe(true)

    const closed = await hostFor({ items: fruit })
    closed.onKey({ detail: { key: 'p' } })
    expect(closed.data.opened).toBe(false)
    expect(closed.data.selected).toEqual(['pear'])
    closed.onKey({ detail: { key: 'p' } })
    expect(closed.data.selected).toEqual(['plum'])
    closed.onKey({ detail: { key: 'z' } })
    expect(closed.data.selected).toEqual(['plum'])

    const frozen = await hostFor({ items: fruit, readOnly: true })
    frozen.onKey({ detail: { key: 'p' } })
    expect(frozen.data.opened).toBe(false)
    expect(frozen.data.selected ?? []).toEqual([])
  })
})
