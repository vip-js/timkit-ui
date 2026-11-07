import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: Record<string, unknown>
  methods?: Record<string, (event?: { mark?: { value?: string } }) => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

const caches = new Map<string, ComponentDefinition>()

const loadDefinition = async (file: string) => {
  const cached = caches.get(file)
  if (cached) return cached
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, file)).href)
  if (!captured) throw new Error(`${file} was not registered`)
  caches.set(file, captured)
  return captured
}

const hostFor = async (file: string, properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition(file)
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const host = {
    properties: { ...defaults, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    events: [] as Array<{ name: string; detail?: { value?: number } }>,
    triggerEvent(name: string, detail?: { value?: number }) {
      host.events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & Record<string, (event?: { mark?: { value?: string } }) => void>
}

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
]

describe('weapp combobox and stepper', () => {
  it('exposes a combobox and a listbox', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'combobox/combobox.wxml'), 'utf8')
    expect(markup).toContain('role="combobox"')
    expect(markup).toContain('aria-label="Close"')
    expect(markup).toContain('aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line>')
    expect(markup.match(/aria-haspopup="listbox"/g)).toHaveLength(12)
    expect(markup).toContain('wx:if="{{api.open && highlight >= 0 && ariaLabel && labelledBy}}"')
    expect(markup).toContain('wx:elif="{{api.open && ariaLabel && labelledBy}}"')
    expect(markup).toContain('aria-activedescendant="{{id}}-option-{{highlight}}"')
    expect(markup).toContain('id="{{id}}-option-{{index}}"')
    expect(markup.split('wx:else')[1].split('root-portal')[0]).not.toContain('aria-activedescendant')
    expect(markup).toContain('wx:elif="{{ariaLabel && labelledBy}}"')
    expect(markup).toContain('wx:elif="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('aria-label="{{label || placeholder}}"')
    expect(markup).not.toContain(
      "aria-label=\"{{ariaLabel ? ariaLabel : (labelledBy ? '' : (label || placeholder))}}\""
    )
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('id="{{id}}-trigger"')
    expect(markup).toContain('aria-controls="{{id}}-listbox"')
    expect(markup).toContain('role="listbox" aria-labelledby="{{id}}-trigger" tabindex="-1"')
    expect(markup).toContain('role="option"')
    expect(markup).toContain('aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline>')
    expect(markup).toContain('wx:for="{{visibleItems}}"')
    expect(markup).toContain('bindinput="onQuery"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('{{emptyLabel}}')
    expect(markup).toContain("{{label || 'Choose an item'}}")
    expect(markup).toContain('aria-label="Close"')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('bindkeydown="onCloseKey"')
    expect(markup).toContain('bindkeydown="onItemKey"')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain("data-highlighted=\"{{highlighted === index ? 'true' : 'false'}}\"")
    const named = await hostFor('combobox/combobox.ts', {
      'aria-label': 'City',
      'aria-labelledby': 'city-title',
    })
    expect(named.data.ariaLabel).toBe('City')
    expect(named.data.labelledBy).toBe('city-title')
    const plain = await hostFor('combobox/combobox.ts')
    expect(plain.data.ariaLabel).toBe('')
    expect(plain.data.labelledBy).toBe('')
    named.setProperty('aria-labelledby', '')
    expect(named.data.labelledBy).toBe('')
  })

  it('combobox follows a later value and keeps it while disabled', async () => {
    const host = await hostFor('combobox/combobox.ts', { items: fruits, value: ['apple'] })
    expect(host.data.selected).toEqual(['apple'])
    expect(host.data.displayValue).toBe('Apple')
    host.setData({ value: ['pear'] })
    expect(host.data.selected).toEqual(['pear'])
    expect(host.data.displayValue).toBe('Pear')
    host.setProperty('value', [])
    expect(host.data.selected).toEqual([])
    expect(host.data.displayValue).toBe('')

    const disabled = await hostFor('combobox/combobox.ts', { items: fruits, disabled: true, value: ['apple'] })
    disabled.onItemTap({ mark: { value: 'pear' } })
    expect(disabled.data.selected).toEqual(['apple'])
    disabled.setData({ value: ['pear'] })
    expect(disabled.data.selected).toEqual(['pear'])
  })

  it('combobox selects the default item and stays empty when the value is empty', async () => {
    const preset = await hostFor('combobox/combobox.ts', { items: fruits, defaultValue: ['pear'] })
    expect(preset.data.selected).toEqual(['pear'])
    expect(preset.data.displayValue).toBe('Pear')

    const held = await hostFor('combobox/combobox.ts', { items: fruits, value: [], defaultValue: ['pear'] })
    expect(held.data.selected).toEqual([])
    expect(held.data.displayValue).toBe('')
    held.onItemTap({ mark: { value: 'pear' } })
    expect(held.data.selected).toEqual([])
  })

  it('combobox opens, selects one value, and ignores both while disabled', async () => {
    const held = await hostFor('combobox/combobox.ts', { items: fruits, value: [] })
    held.onItemTap({ mark: { value: 'pear' } })
    expect(held.data.selected).toEqual([])
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: ['pear'] } })
    held.setProperty('value', ['pear'])
    expect(held.data.selected).toEqual(['pear'])
    expect(held.data.displayValue).toBe('Pear')

    const enabled = await hostFor('combobox/combobox.ts', { items: fruits })
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(true)
    enabled.onItemTap({ mark: { value: 'apple' } })
    expect(enabled.data.selected).toEqual(['apple'])
    expect(enabled.data.displayValue).toBe('Apple')

    const disabled = await hostFor('combobox/combobox.ts', { items: fruits, disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.onItemTap({ mark: { value: 'apple' } })
    expect(disabled.data.selected).toEqual([])
  })

  it('combobox opens from defaultOpen and follows a later open value', async () => {
    const preset = await hostFor('combobox/combobox.ts', { items: fruits, defaultOpen: true })
    expect(preset.data.opened).toBe(true)

    const held = await hostFor('combobox/combobox.ts', { items: fruits, open: false, defaultOpen: true })
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

  it('combobox ignores a selection while read-only and still follows a later value', async () => {
    const frozen = await hostFor('combobox/combobox.ts', { items: fruits, readOnly: true })
    frozen.onItemTap({ mark: { value: 'pear' } })
    expect(frozen.data.selected ?? []).not.toContain('pear')
    expect(frozen.events).toEqual([])
    frozen.setProperty('value', ['pear'])
    expect(frozen.data.selected).toEqual(['pear'])
  })

  it('filters the open list and shows the empty state', async () => {
    const host = await hostFor('combobox/combobox.ts', { items: fruits, defaultOpen: true })
    expect(host.data.visibleItems).toHaveLength(2)
    expect(host.data.empty).toBe(false)
    host.onQuery({ detail: { value: 'pea' } })
    expect(host.data.visibleItems).toEqual([{ label: 'Pear', value: 'pear' }])
    expect(host.data.empty).toBe(false)
    host.onKey({ detail: { key: 'ArrowDown' } })
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.selected).toEqual(['pear'])

    host.onQuery({ detail: { value: 'zzz' } })
    expect(host.data.visibleItems).toEqual([])
    expect(host.data.empty).toBe(true)
    expect(host.properties.emptyLabel).toBe('No results')
    expect(host.properties.placeholder).toBe('Choose an item')

    const disabled = await hostFor('combobox/combobox.ts', { items: fruits, disabled: true })
    disabled.onQuery({ detail: { value: 'pea' } })
    expect(disabled.data.query).toBe('')
    expect(disabled.data.visibleItems).toHaveLength(2)
  })

  it('wraps the highlight by default and stays put when loop is off', async () => {
    const host = await hostFor('combobox/combobox.ts', { items: fruits, defaultOpen: true })
    expect(host.data.opened).toBe(true)
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.highlighted).toBe(0)
    host.onKey({ detail: { key: 'ArrowUp' } })
    expect(host.data.highlighted).toBe(1)
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.selected).toEqual(['pear'])

    const locked = await hostFor('combobox/combobox.ts', { items: fruits, defaultOpen: true, loop: false })
    locked.onKey({ detail: { key: 'ArrowDown' } })
    locked.onKey({ detail: { key: 'ArrowUp' } })
    expect(locked.data.highlighted).toBe(0)
    locked.onKey({ detail: { key: 'ArrowDown' } })
    locked.onKey({ detail: { key: 'ArrowDown' } })
    expect(locked.data.highlighted).toBe(1)

    const disabled = await hostFor('combobox/combobox.ts', { items: fruits, defaultOpen: true, disabled: true })
    disabled.onKey({ detail: { key: 'ArrowDown' } })
    expect(disabled.data.highlighted).toBe(-1)

    const open = await hostFor('combobox/combobox.ts', { items: fruits, defaultOpen: true })
    open.onKey({ detail: { key: 'Escape' } })
    expect(open.data.opened).toBe(false)
    const again = await hostFor('combobox/combobox.ts', { items: fruits, defaultOpen: true })
    again.onCloseKey({ detail: { key: 'Enter' } })
    expect(again.data.opened).toBe(false)
  })

  it('jumps to the first and last enabled item with Home and End without selecting them', async () => {
    const items = [
      { label: 'Apple', value: 'apple', disabled: true },
      { label: 'Pear', value: 'pear' },
      { label: 'Plum', value: 'plum' },
    ]
    const host = await hostFor('combobox/combobox.ts', { items, defaultOpen: true })
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.highlighted).toBe(2)
    expect(host.data.selected ?? []).toEqual([])
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.highlighted).toBe(1)
    expect(host.data.selected ?? []).toEqual([])
    host.onQuery({ detail: { value: 'plum' } })
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.visibleItems).toEqual([{ label: 'Plum', value: 'plum' }])
    expect(host.data.highlighted).toBe(0)
    expect(host.data.selected ?? []).toEqual([])

    const closed = await hostFor('combobox/combobox.ts', { items })
    closed.onKey({ detail: { key: 'Home' } })
    expect(closed.data.opened).toBe(true)
    expect(closed.data.highlighted).toBe(1)
    expect(closed.data.selected ?? []).toEqual([])

    const frozen = await hostFor('combobox/combobox.ts', { items, readOnly: true })
    frozen.onKey({ detail: { key: 'End' } })
    expect(frozen.data.opened).toBe(false)
    expect(frozen.data.highlighted).toBe(-1)

    const disabled = await hostFor('combobox/combobox.ts', { items, disabled: true })
    disabled.onKey({ detail: { key: 'Home' } })
    expect(disabled.data.opened).toBe(false)
  })

  it('stepper increments and ignores the press while disabled', async () => {
    const enabled = await hostFor('stepper/stepper.ts', { value: '2', step: 1 })
    enabled.onIncrementTap()
    expect(enabled.data.current).toBe('2')
    expect(enabled.events.at(-1)).toEqual({ name: 'change', detail: { value: 3 } })
    enabled.setProperty('value', '3')
    expect(enabled.data.current).toBe('3')
    enabled.onDecrementTap()
    expect(enabled.data.current).toBe('3')
    expect(enabled.events.at(-1)).toEqual({ name: 'change', detail: { value: 2 } })
    enabled.setProperty('value', '2')
    expect(enabled.data.current).toBe('2')

    const disabled = await hostFor('stepper/stepper.ts', { value: '2', disabled: true })
    disabled.onIncrementTap()
    expect(disabled.data.current).toBe('2')
  })
})
