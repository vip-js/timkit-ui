import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { value?: string[]; openStatus?: string }
  methods?: Record<string, (event?: { mark?: { value?: string } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'accordion.ts')).href)
  if (!captured) throw new Error('accordion component was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
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
    events: [] as Array<{ name: string; detail?: { value?: string[] } }>,
    triggerEvent(name: string, detail?: { value?: string[] }) {
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
    onItemTap: (event?: { mark?: { value?: string } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string[] } }>
  }
}

describe('weapp accordion type', () => {
  it('exposes an expandable button and its region', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'accordion.wxml'), 'utf8')
    expect(markup).toContain('role="button"')
    expect(markup).toContain("tabindex=\"{{disabled || item.disabled || item.disable ? -1 : 0}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled || item.disabled || item.disable ? 'true' : 'false'}}\"")
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain("aria-expanded=\"{{openMap[item.value] ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="status"')
    expect(markup).toContain('wx:if="{{openMap[item.value]}}"')
    expect(markup).toContain('aria-controls="{{id}}-panel-{{item.value}}"')
    expect(markup.split('wx:else')[1].split('role="region"')[0]).not.toContain('aria-controls')
    expect(markup).toContain('role="region"')
    expect(markup).toContain('aria-labelledby="{{id}}-trigger-{{item.value}}"')
  })

  it('follows a later value and ignores taps while disabled', async () => {
    const host = await hostFor({ type: 'single', value: ['one'] })
    expect(host.data.value).toEqual(['one'])
    host.setProperty('value', ['two'])
    expect(host.data.value).toEqual(['two'])
    host.onItemTap({ mark: { value: 'one' } })
    expect(host.data.value).toEqual(['two'])
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: ['one'] } })
    host.setProperty('value', ['one'])
    expect(host.data.value).toEqual(['one'])

    const disabled = await hostFor({ disabled: true, value: ['one'] })
    disabled.onItemTap({ mark: { value: 'two' } })
    expect(disabled.data.value).toEqual(['one'])
    disabled.setProperty('value', [])
    expect(disabled.data.value).toEqual([])
  })

  it('keeps one item open when type is single and every item when type is multiple', async () => {
    const items = [{ value: 'one' }, { value: 'two' }]
    const single = await hostFor({ type: 'single', items })
    single.onItemTap({ mark: { value: 'one' } })
    single.onItemTap({ mark: { value: 'two' } })
    expect(single.data.value).toEqual(['two'])
    expect(single.data.openStatus).toBe('Item 2 of 2')

    const multiple = await hostFor({ type: 'multiple', items })
    multiple.onItemTap({ mark: { value: 'one' } })
    multiple.onItemTap({ mark: { value: 'two' } })
    expect(multiple.data.value).toEqual(['one', 'two'])
    expect(multiple.data.openStatus).toBe('2 items open')
  })

  it('opens the default item and stays shut when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: ['one'] })
    expect(preset.data.value).toEqual(['one'])

    const held = await hostFor({ value: [], defaultValue: ['one'] })
    expect(held.data.value).toEqual([])
    expect(held.data.openStatus).toBe('')
    held.onItemTap({ mark: { value: 'one' } })
    expect(held.data.value).toEqual([])
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: ['one'] } })
  })

  it('ignores opening while disabled', async () => {
    const host = await hostFor({ disabled: true })
    host.onItemTap({ mark: { value: 'one' } })
    expect(host.data.value).toEqual([])
  })

  it('moves focus with the shared ArrowDown key without opening the next item', async () => {
    const items = [
      { value: 'one', label: 'One', content: 'Details' },
      { value: 'two', label: 'Two', content: 'More' },
      { value: 'locked', label: 'Locked', content: 'Hidden', disabled: true },
    ]
    const host = await hostFor({ type: 'single', value: ['one'], items })
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.focusedValue).toBe('two')
    expect(host.data.value).toEqual(['one'])
    host.onKey({ detail: { key: ' ' } })
    expect(host.data.value).toEqual(['one'])
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: ['two'] } })

    const disabled = await hostFor({ disabled: true, value: ['one'], items })
    disabled.onKey({ detail: { key: 'ArrowDown' } })
    expect(disabled.data.focusedValue ?? '').toBe('')
    expect(disabled.data.value).toEqual(['one'])
  })

  it('moves to the first and last enabled item with Home and End without opening them', async () => {
    const items = [
      { value: 'one', label: 'One', content: 'Details' },
      { value: 'locked', label: 'Locked', content: 'Hidden', disabled: true },
      { value: 'three', label: 'Three', content: 'Last' },
    ]
    const host = await hostFor({ type: 'single', value: ['one'], items })
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.focusedValue).toBe('three')
    expect(host.data.value).toEqual(['one'])
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.focusedValue).toBe('one')
    expect(host.data.value).toEqual(['one'])

    const disabled = await hostFor({ disabled: true, value: ['one'], items })
    disabled.onKey({ detail: { key: 'End' } })
    expect(disabled.data.focusedValue ?? '').toBe('')
    expect(disabled.data.value).toEqual(['one'])
  })

  it('ignores a disabled item', async () => {
    const host = await hostFor({
      type: 'single',
      items: [
        { value: 'one', label: 'One', content: 'Details' },
        { value: 'two', label: 'Two', content: 'Hidden', disabled: true },
      ],
    })
    host.onItemTap({ mark: { value: 'one' } })
    expect(host.data.value).toEqual(['one'])
    host.onItemTap({ mark: { value: 'two' } })
    expect(host.data.value).toEqual(['one'])
  })

  it('keeps a single item open unless collapsing is allowed', async () => {
    const host = await hostFor({ type: 'single' })
    host.onItemTap({ mark: { value: 'one' } })
    host.onItemTap({ mark: { value: 'one' } })
    expect(host.data.value).toEqual(['one'])

    const loose = await hostFor({ type: 'single', collapsible: true })
    loose.onItemTap({ mark: { value: 'one' } })
    loose.onItemTap({ mark: { value: 'one' } })
    expect(loose.data.value).toEqual([])
  })
})
