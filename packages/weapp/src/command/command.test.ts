import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { selected?: string; itemStatus?: string; query?: string; filteredItems?: Array<{ value: string }> }
  methods?: Record<string, (event?: { detail?: { value?: string }; currentTarget?: { dataset?: { value?: string } } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'command.ts')).href)
  if (!captured) throw new Error('command was not registered')
  definitionCache = captured
  return definitionCache
}

const items = [
  { label: 'Open file', value: 'open', keywords: 'file' },
  { label: 'Close', value: 'close', disabled: true },
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
    events: [] as Array<{ name: string; detail?: { detail?: { value?: string } } }>,
    triggerEvent(name: string, detail?: { detail?: { value?: string } }) {
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
    onInput: (event?: { detail?: { value?: string } }) => void
    onSelect: (event?: { currentTarget?: { dataset?: { value?: string } } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    onItemKey: (event?: { detail?: { key?: string }; currentTarget?: { dataset?: { value?: string } } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { detail?: { value?: string } } }>
  }
}

describe('weapp command', () => {
  it('exposes a combobox and its options', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'command.wxml'), 'utf8')
    expect(markup).toContain('aria-label="{{ariaLabel || inputLabel}}"')
    expect(markup).toContain('role="combobox"')
    expect(markup).toContain('aria-controls="{{id}}-listbox"')
    expect(markup).toContain('role="listbox" aria-label="Suggestions"')
    expect(markup).toContain('class="command {{extClass}}" tabindex="-1" aria-disabled="{{disabled ? \'true\' : \'false\'}}"')
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('role="option"')
    expect(markup).toContain('{{item.label || item.value}}')
    expect(markup).toContain('aria-hidden="true">{{item.value}}</text>')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('No results')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain('bindkeydown="onItemKey"')
    expect(markup).toContain('wx:if="{{highlight >= 0}}"')
    expect(markup).toContain('aria-activedescendant="{{id}}-option-{{highlight}}"')
    expect(markup).not.toContain("aria-activedescendant=\"{{highlight >= 0 ? id + '-option-' + highlight : ''}}\"")
  })

  it('follows a later value and ignores taps while disabled', async () => {
    const palette = [
      { label: 'Open file', value: 'open' },
      { label: 'Save file', value: 'save' },
      { label: 'Close', value: 'close', disabled: true },
    ]
    const host = await hostFor({ items: palette, value: 'open' })
    expect(host.data.ariaLabel).toBe('')
    expect(host.data.inputLabel).toBe('Command menu')
    host.setProperty('placeholder', 'Search files')
    expect(host.data.inputLabel).toBe('Search files')
    host.setProperty('aria-label', 'Command menu')
    expect(host.data.ariaLabel).toBe('Command menu')
    expect(host.data.selected).toBe('open')
    expect(host.data.itemStatus).toBe('Item 1 of 3')
    host.setProperty('value', 'save')
    expect(host.data.selected).toBe('save')
    expect(host.data.itemStatus).toBe('Item 2 of 3')
    host.onSelect({ currentTarget: { dataset: { value: 'open' } } })
    expect(host.data.selected).toBe('save')
    expect(host.events.at(-1)?.detail?.detail?.value).toBe('open')
    host.setProperty('value', 'open')
    expect(host.data.selected).toBe('open')

    const disabled = await hostFor({ items: palette, disabled: true, value: 'open' })
    disabled.onSelect({ currentTarget: { dataset: { value: 'save' } } })
    expect(disabled.data.selected).toBe('open')
    disabled.setProperty('value', '')
    expect(disabled.data.selected).toBe('')
    expect(disabled.data.itemStatus).toBe('')
  })

  it('selects the default item and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: 'open' })
    expect(preset.data.selected).toBe('open')
    preset.onSelect({ currentTarget: { dataset: { value: 'close' } } })
    expect(preset.data.selected).toBe('open')

    const held = await hostFor({ value: '', defaultValue: 'open' })
    expect(held.data.selected).toBe('')
    held.onSelect({ currentTarget: { dataset: { value: 'open' } } })
    expect(held.data.selected).toBe('')
    expect(held.events.at(-1)?.detail?.detail?.value).toBe('open')
  })

  it('filters, selects one item, and ignores a disabled item or palette', async () => {
    const enabled = await hostFor()
    enabled.onInput({ detail: { value: 'file' } })
    expect((enabled.data.filteredItems ?? []).map((item) => item.value)).toEqual(['open'])
    enabled.onInput({ detail: { value: '' } })
    enabled.onKey({ detail: { key: 'ArrowDown' } })
    expect(enabled.data.highlight).toBe(0)
    enabled.onKey({ detail: { key: 'Enter' } })
    expect(enabled.data.selected).toBe('open')
    enabled.onSelect({ currentTarget: { dataset: { value: 'close' } } })
    expect(enabled.data.selected).toBe('open')

    const moved = await hostFor({
      items: [
        { label: 'Open file', value: 'open' },
        { label: 'Close', value: 'close', disabled: true },
        { label: 'Save file', value: 'save' },
      ],
    })
    expect(moved.data.highlight).toBe(0)
    moved.onKey({ detail: { key: 'ArrowDown' } })
    expect(moved.data.highlight).toBe(2)
    moved.onKey({ detail: { key: 'Enter' } })
    expect(moved.data.selected).toBe('save')
    moved.onItemKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { value: 'close' } } })
    expect(moved.data.selected).toBe('save')

    const disabled = await hostFor({ disabled: true })
    disabled.onInput({ detail: { value: 'file' } })
    expect(disabled.data.query).toBe('')
    disabled.onKey({ detail: { key: 'ArrowDown' } })
    disabled.onSelect({ currentTarget: { dataset: { value: 'open' } } })
    expect(disabled.data.selected).toBe('')
  })
})
