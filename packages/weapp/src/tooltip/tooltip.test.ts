import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'

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
  await import(pathToFileURL(path.join(__dirname, 'index.ts')).href)
  if (!captured) throw new Error('tooltip was not registered')
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
    events: [] as Array<{ name: string; detail?: { open?: boolean } }>,
    triggerEvent(name: string, detail?: { open?: boolean }) {
      host.events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    detached: () => definition.lifetimes?.detached?.call(host),
  }) as typeof host & {
    onTriggerLongPress: () => void
    onTriggerFocus: () => void
    onTriggerKey: (event?: { detail?: { key?: string } }) => void
    onTriggerTouchEnd: () => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { open?: boolean } }>
    detached: () => void
  }
}

afterEach(() => {
  vi.useRealTimers()
})

describe('weapp tooltip', () => {
  it('names the open content as a tooltip', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'index.wxml'), 'utf8')
    expect(markup).toContain('role="tooltip"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('id="{{id}}-content"')
    expect(markup).toContain('wx:if="{{opened}}"')
    expect(markup).toContain('aria-describedby="{{id}}-content"')
    expect(markup).not.toContain("aria-describedby=\"{{opened ? id + '-content' : ''}}\"")
    expect(markup).toContain('role="button"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('bindfocus="onTriggerFocus"')
    expect(markup).toContain('bindblur="onTriggerTouchEnd"')
    expect(markup).toContain('bindkeydown="onTriggerKey"')
  })

  it('starts open from the default and stays shut when open is false', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.opened).toBe(true)
    preset.onTriggerTouchEnd()
    expect(preset.data.opened).toBe(false)
    preset.detached()

    vi.useFakeTimers()
    const held = await hostFor({ open: false, defaultOpen: true, openDelay: 40 })
    expect(held.data.opened).toBe(false)
    held.onTriggerLongPress()
    vi.advanceTimersByTime(40)
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
    held.detached()
  })

  it('follows a later open value and stays closed when disabled', async () => {
    const host = await hostFor({ open: true })
    expect(host.data.opened).toBe(true)
    host.setData({ open: false })
    expect(host.data.opened).toBe(false)
    host.detached()

    const locked = await hostFor({ disabled: true, openDelay: 0 })
    locked.onTriggerLongPress()
    expect(locked.data.opened).toBe(false)
    locked.setData({ open: true })
    expect(locked.data.opened).toBe(true)
    locked.detached()
  })

  it('opens after the delay, closes on release, and stays closed when disabled', async () => {
    vi.useFakeTimers()
    const host = await hostFor({ openDelay: 700 })
    host.onTriggerLongPress()
    vi.advanceTimersByTime(699)
    expect(host.data.opened).toBe(false)
    vi.advanceTimersByTime(1)
    expect(host.data.opened).toBe(true)
    expect(host.data.openStatus).toBe('Opened')
    host.onTriggerTouchEnd()
    expect(host.data.opened).toBe(false)
    expect(host.data.openStatus).toBe('')

    const cancelled = await hostFor({ openDelay: 700 })
    cancelled.onTriggerLongPress()
    vi.advanceTimersByTime(100)
    cancelled.onTriggerTouchEnd()
    vi.advanceTimersByTime(1000)
    expect(cancelled.data.opened).toBe(false)

    const held = await hostFor({ open: false, openDelay: 40 })
    held.onTriggerLongPress()
    vi.advanceTimersByTime(40)
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
    held.setProperty('open', true)
    expect(held.data.opened).toBe(true)
    held.onTriggerTouchEnd()
    expect(held.data.opened).toBe(true)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: false } })
    held.detached()

    const locked = await hostFor({ disabled: true, openDelay: 0 })
    locked.onTriggerLongPress()
    vi.advanceTimersByTime(1000)
    expect(locked.data.opened).toBe(false)
    host.detached()
    cancelled.detached()
    locked.detached()
  })

  it('opens on focus after the delay and closes on Escape', async () => {
    vi.useFakeTimers()
    const host = await hostFor({ openDelay: 700 })
    host.onTriggerFocus()
    vi.advanceTimersByTime(699)
    expect(host.data.opened).toBe(false)
    vi.advanceTimersByTime(1)
    expect(host.data.opened).toBe(true)
    host.onTriggerKey({ detail: { key: 'Escape' } })
    expect(host.data.opened).toBe(false)

    const cancelled = await hostFor({ openDelay: 700 })
    cancelled.onTriggerFocus()
    vi.advanceTimersByTime(100)
    cancelled.onTriggerTouchEnd()
    vi.advanceTimersByTime(1000)
    expect(cancelled.data.opened).toBe(false)

    const locked = await hostFor({ disabled: true, openDelay: 0 })
    locked.onTriggerFocus()
    vi.advanceTimersByTime(1000)
    expect(locked.data.opened).toBe(false)
    host.detached()
    cancelled.detached()
    locked.detached()
  })

  it('opens after delayDuration and ignores the longer openDelay', async () => {
    vi.useFakeTimers()
    const host = await hostFor({ delayDuration: 40, openDelay: 700 })
    host.onTriggerLongPress()
    vi.advanceTimersByTime(39)
    expect(host.data.opened).toBe(false)
    vi.advanceTimersByTime(1)
    expect(host.data.opened).toBe(true)
    host.detached()
  })
})
