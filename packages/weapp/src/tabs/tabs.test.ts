import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type TabItem = { value: string; label: string; disabled?: boolean }

type ComponentDefinition = {
  data?: { activeValue?: string; tabStatus?: string; api?: { value?: string } }
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
  await import(pathToFileURL(path.join(__dirname, 'index.ts')).href)
  if (!captured) throw new Error('tabs was not registered')
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
    events: [] as Array<{ name: string; detail?: { value?: string } }>,
    triggerEvent(name: string, detail?: { value?: string }) {
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
    handleTabClick: (event?: { currentTarget?: { dataset?: { value?: string } } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string } }>
  }
}

const tabs: TabItem[] = [
  { value: 'account', label: 'Account' },
  { value: 'billing', label: 'Billing' },
  { value: 'locked', label: 'Locked', disabled: true },
]

describe('weapp tabs', () => {
  it('exposes a tablist and the active panel', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'index.wxml'), 'utf8')
    expect(markup).toContain('class="tabs {{className}}" aria-disabled="{{disabled ? \'true\' : \'false\'}}"')
    expect(markup).toContain('role="tablist"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Tabs'}}\"")
    expect(markup).toContain('role="tab"')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain("aria-selected=\"{{activeValue === item.value ? 'true' : 'false'}}\"")
    expect(markup).toContain("tabindex=\"{{disabled || item.disabled || item.disable ? -1 : (activeValue === item.value ? 0 : -1)}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled || item.disabled || item.disable ? 'true' : 'false'}}\"")
    expect(markup).toContain('tabindex="0"')
    expect(markup).toContain('wx:if="{{activeValue === item.value}}"')
    expect(markup).toContain('aria-controls="{{id}}-panel-{{item.value}}"')
    expect(markup.split('wx:else')[1].split('role="tabpanel"')[0]).not.toContain('aria-controls')
    expect(markup).toContain('role="tabpanel"')
    expect(markup).toContain('aria-labelledby="{{id}}-tab-{{activeValue}}"')
  })

  it('follows a later value and ignores taps while disabled', async () => {
    const host = await hostFor({ tabs, value: 'account' })
    expect(host.data.api?.value).toBe('account')
    host.setProperty('value', 'billing')
    expect(host.data.activeValue).toBe('billing')
    expect(host.data.tabStatus).toBe('Tab 2 of 3')
    expect(host.data.api?.value).toBe('billing')
    host.handleTabClick({ currentTarget: { dataset: { value: 'account' } } })
    expect(host.data.activeValue).toBe('billing')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: 'account' } })
    host.setProperty('value', 'account')
    expect(host.data.activeValue).toBe('account')

    const disabled = await hostFor({ tabs, value: 'account', disabled: true })
    disabled.handleTabClick({ currentTarget: { dataset: { value: 'billing' } } })
    expect(disabled.data.api?.value).toBe('account')
    disabled.setProperty('value', 'billing')
    expect(disabled.data.api?.value).toBe('billing')
  })

  it('clears when the parent sets an empty value', async () => {
    const host = await hostFor({ tabs, value: 'account' })
    host.setProperty('value', 'billing')
    expect(host.data.activeValue).toBe('billing')
    host.setProperty('value', '')
    expect(host.data.activeValue).toBe('')
    expect(host.data.tabStatus).toBe('')
    expect(host.data.api?.value == null || host.data.api?.value === '').toBe(true)
    host.handleTabClick({ currentTarget: { dataset: { value: 'account' } } })
    expect(host.data.activeValue).toBe('')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: 'account' } })
    host.setProperty('value', 'account')
    expect(host.data.activeValue).toBe('account')
  })

  it('selects the default tab and stays empty when the value is empty', async () => {
    const preset = await hostFor({ tabs, defaultValue: 'billing' })
    expect(preset.data.activeValue).toBe('billing')
    expect(preset.data.api?.value).toBe('billing')

    const held = await hostFor({ tabs, value: '', defaultValue: 'billing' })
    expect(held.data.activeValue).toBe('')
    held.handleTabClick({ currentTarget: { dataset: { value: 'account' } } })
    expect(held.data.activeValue).toBe('')
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: 'account' } })
  })

  it('moves to the next enabled tab with the shared ArrowRight key', async () => {
    const host = await hostFor({ tabs, defaultValue: 'account' })
    host.onKey({ detail: { key: 'ArrowRight' } })
    expect(host.data.activeValue).toBe('billing')
    host.onKey({ detail: { key: 'ArrowRight' } })
    expect(host.data.activeValue).toBe('account')

    const held = await hostFor({ tabs, value: 'account' })
    held.onKey({ detail: { key: 'ArrowRight' } })
    expect(held.data.activeValue).toBe('account')
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: 'billing' } })

    const disabled = await hostFor({ tabs, defaultValue: 'account', disabled: true })
    disabled.onKey({ detail: { key: 'ArrowRight' } })
    expect(disabled.data.activeValue).toBe('account')
    expect(disabled.events).toEqual([])
  })

  it('moves on the vertical axis only when orientation is vertical', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'index.wxml'), 'utf8')
    expect(markup).toContain(
      "aria-orientation=\"{{orientation === 'vertical' ? 'vertical' : 'horizontal'}}\""
    )
    const vertical = await hostFor({ tabs, defaultValue: 'account', orientation: 'vertical' })
    vertical.onKey({ detail: { key: 'ArrowRight' } })
    expect(vertical.data.activeValue).toBe('account')
    vertical.onKey({ detail: { key: 'ArrowDown' } })
    expect(vertical.data.activeValue).toBe('billing')

    const horizontal = await hostFor({ tabs, defaultValue: 'account' })
    horizontal.onKey({ detail: { key: 'ArrowDown' } })
    expect(horizontal.data.activeValue).toBe('account')
  })

  it('selects the first and last enabled tab with Home and End', async () => {
    const host = await hostFor({ tabs, defaultValue: 'billing' })
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.activeValue).toBe('account')
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.activeValue).toBe('billing')

    const disabled = await hostFor({ tabs, defaultValue: 'billing', disabled: true })
    disabled.onKey({ detail: { key: 'Home' } })
    expect(disabled.data.activeValue).toBe('billing')
    expect(disabled.events).toEqual([])
  })

  it('selects a tab and ignores a disabled tab', async () => {
    const enabled = await hostFor({ tabs })
    expect(enabled.data.activeValue).toBe('')
    enabled.handleTabClick({ currentTarget: { dataset: { value: 'billing' } } })
    expect(enabled.data.activeValue).toBe('billing')
    expect(enabled.data.api?.value).toBe('billing')
    enabled.handleTabClick({ currentTarget: { dataset: { value: 'locked' } } })
    expect(enabled.data.activeValue).toBe('billing')

    const disabled = await hostFor({ tabs, value: 'account', disabled: true })
    disabled.handleTabClick({ currentTarget: { dataset: { value: 'billing' } } })
    expect(disabled.data.activeValue).toBe('account')
  })

  it('uses a passed accessible name and leaves an omitted name empty', async () => {
    const named = await hostFor({ 'aria-label': 'Account sections' })
    expect(named.data.ariaLabel).toBe('Account sections')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    plain.setProperty('aria-label', 'Settings')
    expect(plain.data.ariaLabel).toBe('Settings')
  })
})
