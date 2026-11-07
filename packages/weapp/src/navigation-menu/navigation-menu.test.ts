import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { selected?: string; itemStatus?: string }
  methods?: Record<string, (event?: { currentTarget?: { dataset?: { value?: string } } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'navigation-menu.ts')).href)
  if (!captured) throw new Error('navigation menu was not registered')
  definitionCache = captured
  return definitionCache
}

const items = [
  { label: 'Products', value: 'products' },
  { label: 'Blog', value: 'blog' },
  { label: 'Docs', value: 'docs', disabled: true },
]

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const host = {
    properties: { ...defaults, items, ...properties },
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
    onSelect: (event?: { currentTarget?: { dataset?: { value?: string } } }) => void
    onSelectKey: (event?: { detail?: { key?: string }; currentTarget?: { dataset?: { value?: string } } }) => void
    setProperty: (key: string, value: unknown) => void
  }
}

describe('weapp navigation menu', () => {
  it('exposes the current link', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'navigation-menu.wxml'), 'utf8')
    expect(markup).toContain('role="navigation" aria-disabled="{{disabled ? \'true\' : \'false\'}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Navigation'}}\"")
    expect(markup).not.toContain("aria-label=\"{{labelledBy ? '' : (ariaLabel || 'Navigation')}}\"")
    expect(markup).toContain('role="status"')
    expect(markup).toContain('role="link"')
    expect(markup).toContain('aria-current="page"')
    expect(markup).toContain("tabindex=\"{{disabled || item.disabled ? -1 : 0}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled || item.disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('bindkeydown="onSelectKey"')
  })

  it('uses a passed name and falls back to Navigation', async () => {
    const host = await hostFor()
    expect(host.data.ariaLabel).toBe('')
    const named = await hostFor({ 'aria-label': 'Sections' })
    expect(named.data.ariaLabel).toBe('Sections')
    named.setProperty('aria-label', 'Library')
    expect(named.data.ariaLabel).toBe('Library')
    named.setProperty('aria-label', '')
    expect(named.data.ariaLabel).toBe('')
    const labelled = await hostFor({ 'aria-label': 'Sections', 'aria-labelledby': 'nav-title' })
    expect(labelled.data.labelledBy).toBe('nav-title')
    labelled.setProperty('aria-labelledby', '')
    expect(labelled.data.labelledBy).toBe('')
  })

  it('follows a later value and ignores a disabled menu', async () => {
    const host = await hostFor({ value: 'products', disabled: true })
    expect(host.data.selected).toBe('products')
    expect(host.data.itemStatus).toBe('Item 1 of 3')
    host.onSelect({ currentTarget: { dataset: { value: 'blog' } } })
    expect(host.data.selected).toBe('products')
    host.setProperty('value', 'blog')
    expect(host.data.selected).toBe('blog')
    expect(host.data.itemStatus).toBe('Item 2 of 3')
    host.setProperty('value', '')
    expect(host.data.selected).toBe('')
    expect(host.data.itemStatus).toBe('')
  })

  it('stays empty when value is cleared', async () => {
    const host = await hostFor({ value: 'products' })
    host.setProperty('value', '')
    expect(host.data.selected).toBe('')
    host.onSelect({ currentTarget: { dataset: { value: 'blog' } } })
    expect(host.data.selected).toBe('')
    expect(host.events.at(-1)).toEqual({ name: 'update:value', detail: 'blog' })
  })

  it('selects the default item and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: 'blog' })
    expect(preset.data.selected).toBe('blog')

    const held = await hostFor({ value: '', defaultValue: 'blog' })
    expect(held.data.selected).toBe('')
    held.onSelect({ currentTarget: { dataset: { value: 'products' } } })
    expect(held.data.selected).toBe('')
    expect(held.events.at(-1)).toEqual({ name: 'update:value', detail: 'products' })
  })

  it('keeps the selected item and ignores a disabled item or menu', async () => {
    const enabled = await hostFor()
    expect(enabled.data.selected).toBe('')
    enabled.onSelectKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { value: 'docs' } } })
    expect(enabled.data.selected).toBe('')
    enabled.onSelectKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { value: 'blog' } } })
    expect(enabled.data.selected).toBe('blog')

    const disabled = await hostFor({ disabled: true })
    disabled.onSelectKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { value: 'products' } } })
    expect(disabled.data.selected).toBe('')
  })
})
