import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { open?: boolean; toastClass?: string }
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
  await import(pathToFileURL(path.join(__dirname, 'index.ts')).href)
  if (!captured) throw new Error('toast component was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const events: Array<{ name: string; detail?: unknown }> = []
  const host = {
    properties: { ...defaults, ...properties },
    data,
    events,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    triggerEvent(name: string, detail?: unknown) {
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

describe('weapp toast contract', () => {
  it('follows a later open value', async () => {
    const host = await hostFor({ open: true, title: 'Saved' })
    expect(host.data.open).toBe(true)
    host.setProperty('open', false)
    expect(host.data.open).toBe(false)
    host.setProperty('open', true)
    expect(host.data.open).toBe(true)
  })

  it('uses the destructive style and closes through one open change', async () => {
    const host = await hostFor({ variant: 'destructive', title: 'Removed' })
    expect(host.data.open).toBe(true)
    expect(host.data.toastClass).toContain('bg-destructive')
    host.onCloseKey({ detail: { key: 'Enter' } })
    expect(host.data.open).toBe(false)
    expect(host.events).toContainEqual({ name: 'openchange', detail: { open: false } })
  })

  it('names icon close controls', () => {
    const named = [
      'toast/index.wxml',
      'dialog/dialog.wxml',
      'sheet/sheet.wxml',
      'popover/popover.wxml',
      'alert-dialog/alert-dialog.wxml',
      'select/select.wxml',
      'multiselect/multiselect.wxml',
    ]
    for (const file of named) {
      const markup = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
      expect(markup, file).toContain('aria-label="Close"')
    }
    const toast = fs.readFileSync(path.join(__dirname, 'index.wxml'), 'utf8')
    expect(toast).toContain('role="button"')
    expect(toast).toContain('<text aria-hidden="true">×</text>')
    expect(toast).toContain('Opened')
    expect(toast).toContain('tabindex="0"')
    expect(toast).toContain('bindkeydown="onCloseKey"')
    const tags = fs.readFileSync(path.join(__dirname, '../tags-input/tags-input.wxml'), 'utf8')
    expect(tags).toContain('aria-label="Remove tag"')
    expect(tags).toContain("tabindex=\"{{disabled || readOnly ? -1 : 0}}\"")
  })

  it('stays open when open is controlled and close only requests false', async () => {
    const host = await hostFor({ open: true, title: 'Saved' })
    host.onCloseKey({ detail: { key: ' ' } })
    expect(host.data.open).toBe(true)
    expect(host.events).toEqual([{ name: 'openchange', detail: { open: false } }])
  })

  it('stays closed when open is false and maps the legacy error type', async () => {
    const closed = await hostFor({ open: false })
    expect(closed.data.open).toBe(false)
    const legacy = await hostFor({ type: 'error' })
    expect(legacy.data.toastClass).toContain('bg-destructive')
  })
})
