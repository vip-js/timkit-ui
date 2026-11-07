import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { open?: boolean }
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
  await import(pathToFileURL(path.join(__dirname, 'banner.ts')).href)
  if (!captured) throw new Error('banner was not registered')
  definitionCache = captured
  return definitionCache
}

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
  return host as typeof host & {
    onCloseTap: () => void
    onCloseKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
  }
}

describe('weapp banner', () => {
  it('dismisses when allowed and stays when it is not dismissible', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'banner.wxml'), 'utf8')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('aria-label="Close"')
    expect(markup).toContain('<text aria-hidden="true">×</text>')
    const icon = fs.readFileSync(path.join(__dirname, '../banner-icon/banner-icon.wxml'), 'utf8')
    expect(icon).toContain('data-slot="banner-icon" aria-hidden="true"')
    expect(markup).toContain('tabindex="0"')
    expect(markup).toContain('bindkeydown="onCloseKey"')
    const enabled = await hostFor({ dismissible: true })
    expect(enabled.data.open).toBe(true)
    enabled.onCloseKey({ detail: { key: 'Enter' } })
    expect(enabled.data.open).toBe(false)
    expect(enabled.events).toEqual([{ name: 'change', detail: { open: false } }, { name: 'close' }])

    const fixed = await hostFor()
    fixed.onCloseTap()
    expect(fixed.data.open).toBe(true)
    expect(fixed.events).toEqual([])
  })

  it('stays closed from defaultOpen and follows a later open value', async () => {
    const preset = await hostFor({ dismissible: true, defaultOpen: false })
    expect(preset.data.open).toBe(false)

    const held = await hostFor({ dismissible: true, open: true, defaultOpen: false })
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
