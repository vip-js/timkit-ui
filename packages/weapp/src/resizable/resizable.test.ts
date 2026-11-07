import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { size?: number }
  methods?: Record<string, (event?: { detail?: { value?: number } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'resizable.ts')).href)
  if (!captured) throw new Error('resizable was not registered')
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
    events: [] as Array<{ name: string; detail?: unknown }>,
    triggerEvent(name: string, detail?: unknown) {
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
    onSliderChange: (event?: { detail?: { value?: number } }) => void
    setProperty: (key: string, value: unknown) => void
  }
}

describe('weapp resizable', () => {
  it('stores the clamped size and ignores the slider while disabled', async () => {
    const enabled = await hostFor()
    enabled.onSliderChange({ detail: { value: 90 } })
    expect(enabled.data.size).toBe(80)
    enabled.onSliderChange({ detail: { value: 35 } })
    expect(enabled.data.size).toBe(35)

    const disabled = await hostFor({ disabled: true })
    disabled.onSliderChange({ detail: { value: 70 } })
    expect(disabled.data.size).toBe(50)
    disabled.setProperty('leftPercent', 60)
    expect(disabled.data.size).toBe(60)

    const host = await hostFor()
    host.setProperty('leftPercent', 90)
    expect(host.data.size).toBe(80)
    host.setProperty('leftPercent', 30)
    expect(host.data.size).toBe(30)
    host.setProperty('minPercent', 40)
    expect(host.data.size).toBe(40)
  })

  it('asks the parent before leaving a controlled size', async () => {
    const host = await hostFor({ leftPercent: 50 })
    host.onSliderChange({ detail: { value: 35 } })
    expect(host.data.size).toBe(50)
    expect(host.events.at(-1)).toEqual({ name: 'update:leftPercent', detail: 35 })
    host.setProperty('leftPercent', 35)
    expect(host.data.size).toBe(35)
    host.setProperty('leftPercent', '')
    expect(host.data.size).toBe(35)
    host.onSliderChange({ detail: { value: 60 } })
    expect(host.data.size).toBe(35)
    expect(host.events.at(-1)).toEqual({ name: 'update:leftPercent', detail: 60 })
  })
})
