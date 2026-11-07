import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { current?: number; api?: { page?: number } }
  methods?: Record<string, (event?: { currentTarget?: { dataset?: { page?: number } } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'pagination.ts')).href)
  if (!captured) throw new Error('pagination was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const host = {
    properties: { ...defaults, total: 30, pageSize: 10, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    events: [] as Array<{ name: string; detail: { detail?: { page?: number } } }>,
    triggerEvent(name: string, detail: { detail?: { page?: number } }) {
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
    onNextTap: () => void
    onPrevTap: () => void
    onPrevKey: (event?: { detail?: { key?: string } }) => void
    onNextKey: (event?: { detail?: { key?: string } }) => void
    onPageKey: (event?: { detail?: { key?: string }; currentTarget?: { dataset?: { page?: number } } }) => void
    onPageTap: (event?: { currentTarget?: { dataset?: { page?: number } } }) => void
    events: Array<{ name: string; detail: { detail?: { page?: number } } }>
    setProperty: (key: string, value: unknown) => void
  }
}

describe('weapp pagination', () => {
  it('exposes a pagination navigation', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'pagination.wxml'), 'utf8')
    expect(markup).toContain('role="navigation" aria-label="{{ariaLabel || \'pagination\'}}" aria-disabled="{{disabled ? \'true\' : \'false\'}}"')
    expect(markup).toContain('role="listitem"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'pagination'}}\"")
    expect(markup).toContain('Page {{current}} of {{pageCount}}')
    expect(markup).toContain('aria-current="page"')
    expect(markup).toContain('aria-label="上一页"')
    expect(markup).toContain("tabindex=\"{{!disabled && api.previousPage ? 0 : -1}}\"")
    expect(markup).toContain("tabindex=\"{{!disabled && api.nextPage ? 0 : -1}}\"")
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('aria-label="下一页"')
    expect(markup).toContain('bindkeydown="onPrevKey"')
    expect(markup).toContain('bindkeydown="onNextKey"')
    expect(markup).toContain('bindkeydown="onPageKey"')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    const named = await hostFor({ 'aria-label': 'Pages' })
    expect(named.data.ariaLabel).toBe('Pages')
    named.setProperty('aria-label', '')
    expect(named.data.ariaLabel).toBe('')
  })

  it('follows a later page and still ignores taps while disabled', async () => {
    const host = await hostFor({ page: 1 })
    expect(host.data.current).toBe(1)
    expect(host.data.pageCount).toBe(3)
    expect(host.data.current).toBe(1)
    host.onNextTap()
    expect(host.data.current).toBe(1)
    expect(host.events.at(-1)?.detail.detail?.page).toBe(2)
    host.setData({ page: 3 })
    expect(host.data.current).toBe(3)

    const disabled = await hostFor({ disabled: true, page: 1 })
    disabled.onNextTap()
    expect(disabled.data.current).toBe(1)
    disabled.setData({ page: 2 })
    expect(disabled.data.current).toBe(2)
  })

  it('changes page, stops at the ends, and ignores input while disabled', async () => {
    const enabled = await hostFor()
    expect(enabled.data.current).toBe(1)
    enabled.onPrevTap()
    expect(enabled.data.current).toBe(1)
    enabled.onNextKey({ detail: { key: 'Enter' } })
    expect(enabled.data.current).toBe(2)
    enabled.onPageKey({ detail: { key: ' ' }, currentTarget: { dataset: { page: 3 } } })
    expect(enabled.data.current).toBe(3)
    enabled.onPrevKey({ detail: { key: 'Enter' } })
    expect(enabled.data.current).toBe(2)
    enabled.onPageTap({ currentTarget: { dataset: { page: 3 } } })
    expect(enabled.data.current).toBe(3)
    enabled.onNextTap()
    expect(enabled.data.current).toBe(3)

    const disabled = await hostFor({ disabled: true })
    disabled.onNextTap()
    expect(disabled.data.current).toBe(1)
  })

  it('opens the default page and stays off every page when the page is empty', async () => {
    const preset = await hostFor({ defaultPage: 3, total: 40 })
    expect(preset.data.current).toBe(3)
    preset.onPrevTap()
    expect(preset.data.current).toBe(2)

    const held = await hostFor({ page: '', defaultPage: 3, total: 40 })
    expect(held.data.current).toBe(0)
    held.onNextTap()
    expect(held.data.current).toBe(0)
    expect(held.events.at(-1)?.detail.detail?.page).toBe(1)
  })

  it('stays off every page when the parent clears the page', async () => {
    const host = await hostFor({ page: 2 })
    expect(host.data.current).toBe(2)
    host.setProperty('page', '')
    expect(host.data.current).toBe(0)
    host.onNextTap()
    expect(host.data.current).toBe(0)
    expect(host.events.at(-1)?.detail.detail?.page).toBe(1)
  })

  it('keeps fewer page numbers when siblingCount is 0', async () => {
    const pageValues = (host: { data: { api?: { pages?: Array<{ type?: string; value?: number }> } } }) =>
      (host.data.api?.pages ?? []).flatMap((item) => (item.type === 'page' && item.value != null ? [item.value] : []))
    const wide = await hostFor({ total: 100, pageSize: 10, page: 5, siblingCount: 1 })
    const narrow = await hostFor({ total: 100, pageSize: 10, page: 5, siblingCount: 0 })
    expect(pageValues(wide)).toEqual([1, 4, 5, 6, 10])
    expect(pageValues(narrow)).toEqual([1, 5, 10])
  })

  it('rebuilds the page list when page size or the item count changes', async () => {
    const pageValues = (host: { data: { api?: { pages?: Array<{ type?: string; value?: number }> } } }) =>
      (host.data.api?.pages ?? []).flatMap((item) => (item.type === 'page' && item.value != null ? [item.value] : []))
    const host = await hostFor({ total: 100, pageSize: 10, page: 1 })
    expect(pageValues(host)).toContain(10)
    host.setProperty('pageSize', 50)
    expect(pageValues(host)).toEqual([1, 2])
    host.setProperty('total', 50)
    expect(pageValues(host)).toEqual([1])
  })
})
