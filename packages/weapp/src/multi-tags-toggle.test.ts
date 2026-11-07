import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: Record<string, unknown>
  methods?: Record<string, (event?: Record<string, unknown>) => void>
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
    triggerEvent() {},
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & Record<string, (event?: Record<string, unknown>) => void>
}

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Pear', value: 'pear' },
]

describe('weapp multiselect tags and toggle', () => {
  it('multiselect keeps both values and ignores open and select while disabled', async () => {
    const enabled = await hostFor('multiselect/multiselect.ts', { items: fruits })
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(true)
    enabled.onItemTap({ mark: { value: 'apple' } })
    enabled.onItemTap({ mark: { value: 'pear' } })
    expect(enabled.data.selected).toEqual(['apple', 'pear'])

    const disabled = await hostFor('multiselect/multiselect.ts', { items: fruits, disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.onItemTap({ mark: { value: 'apple' } })
    expect(disabled.data.selected).toEqual([])
  })

  it('tags input adds tags and ignores a new tag while disabled', async () => {
    const enabled = await hostFor('tags-input/tags-input.ts')
    enabled.onConfirm({ detail: { value: 'red' } })
    enabled.onConfirm({ detail: { value: 'blue' } })
    expect(enabled.data.tags).toEqual(['red', 'blue'])
    enabled.onDeleteTag({ currentTarget: { dataset: { index: 0 } } })
    expect(enabled.data.tags).toEqual(['blue'])

    const disabled = await hostFor('tags-input/tags-input.ts', { disabled: true })
    disabled.onConfirm({ detail: { value: 'red' } })
    expect(disabled.data.tags).toEqual([])
  })

  it('toggle turns on and off, and ignores a tap while disabled', async () => {
    const enabled = await hostFor('toggle/toggle.ts')
    enabled.onTap()
    expect(enabled.data.on).toBe(true)
    enabled.onTap()
    expect(enabled.data.on).toBe(false)

    const disabled = await hostFor('toggle/toggle.ts', { disabled: true })
    disabled.onTap()
    expect(disabled.data.on).toBe(false)
  })
})
