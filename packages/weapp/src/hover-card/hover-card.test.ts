import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, it, vi } from 'vitest'

type ComponentDefinition = {
  data?: { open?: boolean; openStatus?: string }
  methods?: Record<string, () => void>
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
  await import(pathToFileURL(path.join(__dirname, 'hover-card.ts')).href)
  if (!captured) throw new Error('hover card was not registered')
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
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }) as typeof host & {
    onTriggerEnter: () => void
    onTriggerLeave: () => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { open?: boolean } }>
  }
}

describe('weapp hover card', () => {
  it('follows a later open value and ignores a disabled trigger', async () => {
    const host = await hostFor({ open: true })
    expect(host.data.open).toBe(true)
    host.setProperty('open', false)
    expect(host.data.open).toBe(false)

    const disabled = await hostFor({ disabled: true, openDelay: 40 })
    disabled.onTriggerEnter()
    expect(disabled.data.open).toBe(false)
    disabled.setProperty('open', true)
    expect(disabled.data.open).toBe(true)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts open from the default and stays shut when open is false', async () => {
    vi.useFakeTimers()
    const preset = await hostFor({ defaultOpen: true, closeDelay: 20 })
    expect(preset.data.open).toBe(true)
    preset.onTriggerLeave()
    await vi.advanceTimersByTimeAsync(20)
    expect(preset.data.open).toBe(false)

    const held = await hostFor({ open: false, defaultOpen: true, openDelay: 40 })
    expect(held.data.open).toBe(false)
    held.onTriggerEnter()
    await vi.advanceTimersByTimeAsync(40)
    expect(held.data.open).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'openChange', detail: { open: true } })
  })

  it('opens after the delay, closes after leave, and ignores a disabled trigger', async () => {
    vi.useFakeTimers()
    const enabled = await hostFor({ openDelay: 40, closeDelay: 20 })
    enabled.onTriggerEnter()
    await vi.advanceTimersByTimeAsync(39)
    expect(enabled.data.open).toBe(false)
    expect(enabled.data.openStatus).toBe('')
    await vi.advanceTimersByTimeAsync(1)
    expect(enabled.data.open).toBe(true)
    expect(enabled.data.openStatus).toBe('Opened')
    enabled.onTriggerLeave()
    await vi.advanceTimersByTimeAsync(20)
    expect(enabled.data.open).toBe(false)
    expect(enabled.data.openStatus).toBe('')

    const disabled = await hostFor({ openDelay: 40, disabled: true })
    disabled.onTriggerEnter()
    await vi.advanceTimersByTimeAsync(40)
    expect(disabled.data.open).toBe(false)

    const locked = await hostFor({ open: false, openDelay: 40, closeDelay: 20 })
    locked.onTriggerEnter()
    await vi.advanceTimersByTimeAsync(40)
    expect(locked.data.open).toBe(false)
    expect(locked.events.at(-1)).toEqual({ name: 'openChange', detail: { open: true } })
    locked.setProperty('open', true)
    expect(locked.data.open).toBe(true)
    locked.onTriggerLeave()
    await vi.advanceTimersByTimeAsync(20)
    expect(locked.data.open).toBe(true)
    expect(locked.events.at(-1)).toEqual({ name: 'openChange', detail: { open: false } })

    const late = await hostFor({ openDelay: 40 })
    late.onTriggerEnter()
    late.properties.disabled = true
    await vi.advanceTimersByTimeAsync(40)
    expect(late.data.open).toBe(false)
  })

  it('opens from focus, closes from blur, and closes immediately on Escape', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'hover-card.wxml'), 'utf8')
    expect(markup).toContain('bindfocus="onTriggerFocus"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('role="button"')
    expect(markup).toContain("aria-expanded=\"{{open ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('bindblur="onTriggerBlur"')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain('id="{{id}}-content"')
    expect(markup).toContain('wx:if="{{open}}"')
    expect(markup).toContain('aria-describedby="{{id}}-content"')
    expect(markup).not.toContain("aria-describedby=\"{{open ? id + '-content' : ''}}\"")
    vi.useFakeTimers()
    const host = await hostFor({ openDelay: 40, closeDelay: 20 })
    host.onTriggerFocus()
    await vi.advanceTimersByTimeAsync(40)
    expect(host.data.open).toBe(true)
    host.onTriggerBlur()
    expect(host.data.open).toBe(false)

    const open = await hostFor({ defaultOpen: true })
    open.onKey({ detail: { key: 'Escape' } })
    expect(open.data.open).toBe(false)

    const held = await hostFor({ open: true })
    held.onKey({ detail: { key: 'Escape' } })
    expect(held.data.open).toBe(true)
    expect(held.events.at(-1)).toEqual({ name: 'openChange', detail: { open: false } })

    const disabled = await hostFor({ openDelay: 40, disabled: true })
    disabled.onTriggerFocus()
    await vi.advanceTimersByTimeAsync(40)
    expect(disabled.data.open).toBe(false)
  })
})
