import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { opened?: boolean; openStatus?: string }
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
  await import(pathToFileURL(path.join(__dirname, 'collapsible.ts')).href)
  if (!captured) throw new Error('collapsible was not registered')
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
    onTriggerTap: () => void
    onTriggerKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    detached: () => void
  }
}

describe('weapp collapsible', () => {
  it('exposes an expandable region', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'collapsible.wxml'), 'utf8')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('class="collapsible-icon" aria-hidden="true"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('bindkeydown="onTriggerKey"')
    expect(markup).toContain("aria-expanded=\"{{opened ? 'true' : 'false'}}\"")
    expect(markup).toContain('aria-controls="{{id}}-content"')
    expect(markup).toContain('role="region"')
  })

  it('follows a later open value and still ignores a disabled trigger', async () => {
    const host = await hostFor()
    host.setData({ open: true })
    expect(host.data.opened).toBe(true)
    expect(host.data.openStatus).toBe('Opened')
    host.setData({ open: false })
    expect(host.data.opened).toBe(false)
    expect(host.data.openStatus).toBe('')
    host.detached()

    const disabled = await hostFor({ disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.setData({ open: true })
    expect(disabled.data.opened).toBe(true)
    disabled.detached()
  })

  it('starts open from the default and stays shut when open is false', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.opened).toBe(true)
    preset.onTriggerTap()
    expect(preset.data.opened).toBe(false)
    preset.detached()

    const held = await hostFor({ open: false, defaultOpen: true })
    expect(held.data.opened).toBe(false)
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)?.detail).toMatchObject({ detail: { open: true } })
    held.detached()
  })

  it('opens from the trigger and ignores a disabled trigger', async () => {
    const held = await hostFor({ open: false })
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)?.detail).toMatchObject({ detail: { open: true } })
    held.setProperty('open', true)
    expect(held.data.opened).toBe(true)
    held.detached()

    const host = await hostFor()
    expect(host.data.opened).toBe(false)
    host.onTriggerKey({ detail: { key: 'Enter' } })
    expect(host.data.opened).toBe(true)
    expect(host.events.length).toBeGreaterThan(0)

    const locked = await hostFor({ disabled: true })
    locked.onTriggerKey({ detail: { key: ' ' } })
    expect(locked.data.opened).toBe(false)
    expect(locked.events).toEqual([])
    host.detached()
    locked.detached()
  })
})
