import path from 'node:path'
import { pathToFileURL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { pickerValue?: string; dayStatus?: string; api?: { setValue?: (value: string[]) => void } }
  methods?: Record<string, (event?: { detail?: { value?: string } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'datefield.ts')).href)
  if (!captured) throw new Error('date field component was not registered')
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
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onPickerChange: (event?: { detail?: { value?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string[] } }>
  }
}

describe('weapp date field', () => {
  it('shows the current day as status text', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'datefield.wxml'), 'utf8')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('tabindex="{{disabled ? -1 : 0}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || pickerValue || placeholder || 'Date'}}\"")
  })

  it('names the date control from a passed label, the current day, or Date', async () => {
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    expect(plain.properties.placeholder).toBe('Date')
    const named = await hostFor({ 'aria-label': 'Birthday', value: ['2026-11-07'] })
    expect(named.data.ariaLabel).toBe('Birthday')
    named.setProperty('aria-label', '')
    expect(named.data.ariaLabel).toBe('')
  })

  it('writes the picked date into the field', async () => {
    const host = await hostFor()
    host.onPickerChange({ detail: { value: '2026-11-07' } })
    expect(host.data.pickerValue).toBe('2026-11-07')
  })

  it('shows the default day and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: ['2026-11-01'] })
    expect(preset.properties.placeholder).toBe('Date')
    expect(preset.data.pickerValue).toBe('2026-11-01')

    const held = await hostFor({ value: [], defaultValue: ['2026-11-01'] })
    expect(held.data.pickerValue).toBe('')
    held.onPickerChange({ detail: { value: '2026-11-08' } })
    expect(held.data.pickerValue).toBe('')
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: ['2026-11-08'] } })
  })

  it('follows a later value', async () => {
    const host = await hostFor({ value: ['2026-11-01'] })
    expect(host.data.dayStatus).toBe('2026-11-01')
    host.setProperty('value', ['2026-11-07'])
    expect(host.data.pickerValue).toBe('2026-11-07')
    expect(host.data.dayStatus).toBe('2026-11-07')
    host.setProperty('value', [])
    expect(host.data.pickerValue).toBe('')
    expect(host.data.dayStatus).toBe('')
    host.onPickerChange({ detail: { value: '2026-11-08' } })
    expect(host.data.pickerValue).toBe('')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: ['2026-11-08'] } })
    host.setProperty('value', ['2026-11-08'])
    expect(host.data.pickerValue).toBe('2026-11-08')
  })

  it('ignores a picked date while disabled', async () => {
    const host = await hostFor({ disabled: true })
    host.onPickerChange({ detail: { value: '2026-11-07' } })
    expect(host.data.pickerValue || '').toBe('')
  })

  it('ignores a picked date while read-only and still follows a later value', async () => {
    const host = await hostFor({ readOnly: true, value: ['2026-11-01'] })
    const before = host.events.length
    host.onPickerChange({ detail: { value: '2026-11-07' } })
    expect(host.data.pickerValue).toBe('2026-11-01')
    expect(host.events).toHaveLength(before)
    host.setProperty('value', ['2026-11-08'])
    expect(host.data.pickerValue).toBe('2026-11-08')
  })

  it('ignores a picked date outside min and max', async () => {
    const host = await hostFor({ min: '2026-11-05', max: '2026-11-10' })
    host.onPickerChange({ detail: { value: '2026-11-01' } })
    expect(host.data.pickerValue || '').toBe('')
    expect(host.events).toEqual([])
    host.onPickerChange({ detail: { value: '2026-11-12' } })
    expect(host.events).toEqual([])
    host.onPickerChange({ detail: { value: '2026-11-07' } })
    expect(host.data.pickerValue).toBe('2026-11-07')
  })
})
