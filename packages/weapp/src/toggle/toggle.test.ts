import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { on?: boolean; pressStatus?: string }
  methods?: Record<string, () => void>
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
  await import(pathToFileURL(path.join(__dirname, 'toggle.ts')).href)
  if (!captured) throw new Error('toggle was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const events: Array<{ name: string; detail: unknown }> = []
  const host = {
    properties: { ...defaults, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    triggerEvent(name: string, detail: unknown) {
      events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    events,
    detached: () => definition.lifetimes?.detached?.call(host),
  }) as typeof host & {
    events: Array<{ name: string; detail: unknown }>
    onTap: () => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    detached: () => void
  }
}

describe('weapp toggle', () => {
  it('exposes a pressed button', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'toggle.wxml'), 'utf8')
    expect(markup).toContain('role="button"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain("aria-pressed=\"{{on ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="status"')
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
  })

  it('follows a later pressed value and ignores a disabled tap', async () => {
    const host = await hostFor()
    host.setData({ pressed: true })
    expect(host.data.on).toBe(true)
    host.setData({ pressed: false })
    expect(host.data.on).toBe(false)
    host.detached()

    const locked = await hostFor({ disabled: true })
    locked.onTap()
    expect(locked.data.on).toBe(false)
    locked.setData({ pressed: true })
    expect(locked.data.on).toBe(true)
    locked.detached()
  })

  it('starts pressed from the default and stays off when pressed is false', async () => {
    const preset = await hostFor({ defaultPressed: true })
    expect(preset.data.on).toBe(true)
    preset.onTap()
    expect(preset.data.on).toBe(false)
    preset.detached()

    const held = await hostFor({ pressed: false, defaultPressed: true })
    expect(held.data.on).toBe(false)
    held.onTap()
    expect(held.data.on).toBe(false)
    expect(held.events.at(-1)?.detail).toMatchObject({ detail: { pressed: true } })
    held.detached()
  })

  it('asks the parent before leaving a controlled press', async () => {
    const host = await hostFor({ pressed: false })
    host.onTap()
    expect(host.data.on).toBe(false)
    expect(host.events.at(-1)?.detail).toMatchObject({ detail: { pressed: true } })
    host.setProperty('pressed', true)
    expect(host.data.on).toBe(true)
    host.detached()
  })

  it('turns on and off, and ignores a disabled toggle', async () => {
    const host = await hostFor()
    expect(host.data.on).toBe(false)
    expect(host.data.pressStatus).toBe('')
    host.onKey({ detail: { key: ' ' } })
    expect(host.data.on).toBe(true)
    expect(host.data.pressStatus).toBe('Pressed')
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.on).toBe(false)
    expect(host.data.pressStatus).toBe('')
    expect(host.events.length).toBe(2)

    const locked = await hostFor({ disabled: true })
    locked.onKey({ detail: { key: ' ' } })
    expect(locked.data.on).toBe(false)
    expect(locked.events).toEqual([])
    host.detached()
    locked.detached()
  })
})
