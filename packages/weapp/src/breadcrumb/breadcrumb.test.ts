import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: Record<string, unknown>
  methods?: Record<string, (event?: unknown) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'breadcrumb.ts')).href)
  if (!captured) throw new Error('breadcrumb was not registered')
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
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    events,
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }) as typeof host & {
    events: Array<{ name: string; detail: unknown }>
    setProperty: (key: string, value: unknown) => void
    onItemTap: (event: { currentTarget: { dataset: { index?: number } } }) => void
    onItemKey: (event: { detail?: { key?: string }; currentTarget: { dataset: { index?: number } } }) => void
  }
}

describe('weapp breadcrumb', () => {
  it('exposes the current page in the breadcrumb', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'breadcrumb.wxml'), 'utf8')
    expect(markup).toContain('role="navigation" aria-label="{{ariaLabel || \'breadcrumb\'}}" aria-disabled="{{disabled ? \'true\' : \'false\'}}"')
    expect(markup).toContain('role="listitem"')
    expect(markup).toContain('role="presentation"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'breadcrumb'}}\"")
    expect(markup).toContain('aria-current="page"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain("tabindex=\"{{disabled || item.disabled ? -1 : 0}}\"")
    expect(markup).toContain('role="link"')
    expect(markup).toContain('bindkeydown="onItemKey"')
    expect(markup).toContain('aria-hidden="true"')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    const named = await hostFor({ 'aria-label': 'Trail' })
    expect(named.data.ariaLabel).toBe('Trail')
    named.setProperty('aria-label', '')
    expect(named.data.ariaLabel).toBe('')
  })

  it('follows an ancestor link and ignores the current page and a disabled crumb', async () => {
    const host = await hostFor({
      items: ['Home', { label: 'Locked', disabled: true }, 'Current'],
    })
    host.onItemKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { index: 0 } } })
    host.onItemKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { index: 1 } } })
    host.onItemKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { index: 2 } } })
    expect(host.events).toEqual([{ name: 'tap', detail: { index: 0, item: 'Home' } }])
    expect(host.data.crumbStatus).toBe('Crumb 3 of 3')

    const locked = await hostFor({ items: ['Home', 'Library'], disabled: true })
    locked.onItemKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { index: 0 } } })
    expect(locked.events).toEqual([])
  })

  it('uses / unless a separator is passed', async () => {
    const host = await hostFor({ items: ['Home', 'Library'] })
    expect(host.properties.separator).toBe('/')
    const custom = await hostFor({ items: ['Home', 'Library'], separator: '>' })
    expect(custom.properties.separator).toBe('>')
  })
})
