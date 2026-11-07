import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { selected?: string[] }
  methods?: Record<string, (event?: { currentTarget?: { dataset?: { value?: string } } }) => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'list-box.ts')).href)
  if (!captured) throw new Error('list box was not registered')
  definitionCache = captured
  return definitionCache
}

const items = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
  { label: 'Plum', value: 'plum', disabled: true },
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
    events: [] as Array<{ name: string; detail?: { value?: string } }>,
    triggerEvent(name: string, detail?: { value?: string }) {
      host.events.push({ name, detail })
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }) as typeof host & {
    onSelect: (event?: { currentTarget?: { dataset?: { value?: string } } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string } }>
  }
}

describe('weapp list box', () => {
  it('exposes a listbox of options', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'list-box.wxml'), 'utf8')
    expect(markup).toContain('role="listbox"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'List'}}\"")
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('role="option"')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain('wx:if="{{highlight >= 0}}"')
    expect(markup).toContain('aria-activedescendant="{{id}}-option-{{highlight}}"')
    expect(markup).not.toContain("aria-activedescendant=\"{{highlight >= 0 ? id + '-option-' + highlight : ''}}\"")
    expect(markup).toContain("aria-selected=\"{{selected.indexOf(item.value) > -1 ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    const named = await hostFor({ 'aria-label': 'Fruits' })
    expect(named.data.ariaLabel).toBe('Fruits')
    named.setProperty('aria-label', '')
    expect(named.data.ariaLabel).toBe('')
  })

  it('follows a later value and ignores taps while disabled', async () => {
    const host = await hostFor({ value: 'apple' })
    expect(host.data.selected).toEqual(['apple'])
    host.onSelect({ currentTarget: { dataset: { value: 'pear' } } })
    expect(host.data.selected).toEqual(['apple'])
    expect(host.events.at(-1)?.detail?.value).toBe('pear')
    host.setProperty('value', 'pear')
    expect(host.data.selected).toEqual(['pear'])
    host.setProperty('value', null)
    expect(host.data.selected).toEqual([])
    host.onSelect({ currentTarget: { dataset: { value: 'apple' } } })
    expect(host.data.selected).toEqual(['apple'])

    const disabled = await hostFor({ disabled: true, value: 'apple' })
    disabled.onSelect({ currentTarget: { dataset: { value: 'pear' } } })
    expect(disabled.data.selected).toEqual(['apple'])
    disabled.setProperty('value', '')
    expect(disabled.data.selected).toEqual([])
  })

  it('selects the default item and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: 'pear' })
    expect(preset.data.selected).toEqual(['pear'])
    preset.onSelect({ currentTarget: { dataset: { value: 'apple' } } })
    expect(preset.data.selected).toEqual(['apple'])

    const held = await hostFor({ value: '', defaultValue: 'pear' })
    expect(held.data.selected).toEqual([])
    held.onSelect({ currentTarget: { dataset: { value: 'pear' } } })
    expect(held.data.selected).toEqual([])
    expect(held.events.at(-1)?.detail?.value).toBe('pear')
  })

  it('selects one item, keeps several when multiple, and ignores disabled input', async () => {
    const single = await hostFor()
    single.onSelect({ currentTarget: { dataset: { value: 'apple' } } })
    expect(single.data.selected).toEqual(['apple'])
    single.onSelect({ currentTarget: { dataset: { value: 'pear' } } })
    expect(single.data.selected).toEqual(['pear'])
    single.onSelect({ currentTarget: { dataset: { value: 'plum' } } })
    expect(single.data.selected).toEqual(['pear'])

    const multiple = await hostFor({ multiple: true })
    multiple.onSelect({ currentTarget: { dataset: { value: 'apple' } } })
    multiple.onSelect({ currentTarget: { dataset: { value: 'pear' } } })
    expect(multiple.data.selected).toEqual(['apple', 'pear'])
    multiple.onSelect({ currentTarget: { dataset: { value: 'apple' } } })
    expect(multiple.data.selected).toEqual(['pear'])

    const disabled = await hostFor({ disabled: true })
    disabled.onSelect({ currentTarget: { dataset: { value: 'apple' } } })
    expect(disabled.data.selected).toEqual([])
  })

  it('moves the highlight with arrows, skips a disabled option, and selects with Enter', async () => {
    const host = await hostFor()
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.highlight).toBe(0)
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.highlight).toBe(1)
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.highlight).toBe(0)
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.selected).toEqual(['apple'])

    const held = await hostFor({ value: 'apple' })
    held.onKey({ detail: { key: 'ArrowDown' } })
    held.onKey({ detail: { key: 'ArrowDown' } })
    held.onKey({ detail: { key: ' ' } })
    expect(held.data.selected).toEqual(['apple'])
    expect(held.events.at(-1)?.detail?.value).toBe('pear')

    const disabled = await hostFor({ disabled: true })
    disabled.onKey({ detail: { key: 'ArrowDown' } })
    disabled.onKey({ detail: { key: 'Enter' } })
    expect(disabled.data.highlight).toBe(-1)
    expect(disabled.data.selected).toEqual([])
    expect(disabled.events).toEqual([])
  })

  it('moves the highlight with Home, End, and a letter without selecting', async () => {
    const rows = [
      { label: 'Apple', value: 'apple', disabled: true },
      { label: 'Pear', value: 'pear' },
      { label: 'Plum', value: 'plum' },
      { label: 'Peach', value: 'peach' },
    ]
    const host = await hostFor({ items: rows })
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(1)
    expect(host.data.selected).toEqual([])
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(2)
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(3)
    host.onKey({ detail: { key: 'z' } })
    expect(host.data.highlight).toBe(3)
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.highlight).toBe(1)
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.highlight).toBe(3)
    expect(host.data.selected).toEqual([])

    const disabled = await hostFor({ items: rows, disabled: true })
    disabled.onKey({ detail: { key: 'p' } })
    disabled.onKey({ detail: { key: 'End' } })
    expect(disabled.data.highlight).toBe(-1)
    expect(disabled.data.selected).toEqual([])
  })
})
