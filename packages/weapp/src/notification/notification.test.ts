import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'

type ComponentDefinition = {
  data?: { open?: boolean }
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
  await import(pathToFileURL(path.join(__dirname, 'notification.ts')).href)
  if (!captured) throw new Error('notification was not registered')
  definitionCache = captured
  return definitionCache
}

const hosts: Array<{ detached?: () => void }> = []

afterEach(() => {
  for (const host of hosts) host.detached?.()
  hosts.length = 0
  vi.useRealTimers()
})

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const events: Array<{ name: string; detail?: { open?: boolean } }> = []
  const host = {
    properties: { ...defaults, ...properties },
    data,
    events,
    _timer: undefined as ReturnType<typeof setTimeout> | undefined,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    triggerEvent(name: string, detail?: { open?: boolean }) {
      events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  const live = host as typeof host & {
    onCloseTap: () => void
    onCloseKey: (event?: { detail?: { key?: string } }) => void
    detached: () => void
  }
  live.detached = () => definition.lifetimes?.detached?.call(host)
  hosts.push(live)
  return live
}

describe('weapp notification', () => {
  it('closes from the button and from the timer, and ignores a manual close when it is not closable', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'notification.wxml'), 'utf8')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('aria-label="Close"')
    expect(markup).toContain('<text aria-hidden="true">×</text>')
    const icon = fs.readFileSync(path.join(__dirname, '../notification-icon/notification-icon.wxml'), 'utf8')
    expect(icon).toContain('data-slot="notification-icon" aria-hidden="true"')
    expect(markup).toContain('tabindex="0"')
    expect(markup).toContain('bindkeydown="onCloseKey"')
    vi.useFakeTimers()
    const enabled = await hostFor({ duration: 1000 })
    expect(enabled.data.open).toBe(true)
    enabled.onCloseKey({ detail: { key: ' ' } })
    expect(enabled.data.open).toBe(false)
    expect(enabled.events).toEqual([{ name: 'change', detail: { open: false } }, { name: 'close' }])

    const timed = await hostFor({ duration: 1000, closable: false })
    timed.onCloseTap()
    expect(timed.data.open).toBe(true)
    vi.advanceTimersByTime(1000)
    expect(timed.data.open).toBe(false)
    expect(timed.events).toEqual([{ name: 'change', detail: { open: false } }, { name: 'close' }])
  })

  it('stays closed from defaultOpen and follows a later open value', async () => {
    const preset = await hostFor({ defaultOpen: false, duration: 0 })
    expect(preset.data.open).toBe(false)

    const held = await hostFor({ open: true, defaultOpen: false, duration: 0 })
    expect(held.data.open).toBe(true)
    held.onCloseTap()
    expect(held.data.open).toBe(true)
    expect(held.events).toEqual([{ name: 'change', detail: { open: false } }, { name: 'close' }])
    held.setProperty('open', false)
    expect(held.data.open).toBe(false)
    held.setProperty('open', null)
    expect(held.data.open).toBe(false)
  })
})
