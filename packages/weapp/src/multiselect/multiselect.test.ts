import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { opened?: boolean; selected?: string[]; optionStatus?: string }
  methods?: {
    onTriggerTap?: () => void
    onItemTap?: (event?: { mark?: { value?: string }; currentTarget?: { dataset?: { value?: string } } }) => void
  }
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
  await import(pathToFileURL(path.join(__dirname, 'multiselect.ts')).href)
  if (!captured) throw new Error('multiselect was not registered')
  definitionCache = captured
  return definitionCache
}

const items = [
  { label: 'Pear', value: 'pear' },
  { label: 'Apple', value: 'apple', disable: true },
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
    events: [] as Array<{ name: string; detail?: { value?: string[]; open?: boolean } }>,
    triggerEvent(name: string, detail?: { value?: string[]; open?: boolean }) {
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
    onTriggerTap: () => void
    onItemTap: (event?: { mark?: { value?: string }; currentTarget?: { dataset?: { value?: string } } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    onItemKey: (event?: { detail?: { key?: string }; mark?: { value?: string } }) => void
    onCloseKey: (event?: { detail?: { key?: string } }) => void
    onConfirmKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string[]; open?: boolean } }>
  }
}

const tap = (value: string) => ({ mark: { value }, currentTarget: { dataset: { value } } })

describe('weapp multiselect', () => {
  it('exposes a multiselectable listbox', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'multiselect.wxml'), 'utf8')
    expect(markup).toContain('role="combobox"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('id="{{id}}-trigger"')
    expect(markup).toContain('aria-controls="{{id}}-listbox"')
    expect(markup).toContain('wx:elif="{{opened}}"')
    expect(markup.split('wx:else')[1].split('multiselect-overlay')[0]).not.toContain('aria-controls')
    expect(markup).toContain('wx:if="{{opened && highlight >= 0}}"')
    expect(markup).toContain('aria-activedescendant="{{id}}-option-{{highlight}}"')
    expect(markup).not.toContain("aria-activedescendant=\"{{opened ? id + '-option-' + highlight : ''}}\"")
    expect(markup).toContain('role="listbox"')
    expect(markup).toContain('aria-labelledby="{{id}}-trigger"')
    expect(markup).toContain('aria-multiselectable="true"')
    expect(markup).toContain('role="option"')
    expect(markup).toContain('class="multiselect-arrow" aria-hidden="true"')
    expect(markup).toContain('aria-hidden="true">✓</text>')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain('bindkeydown="onItemKey"')
    expect(markup).toContain('aria-label="Close"')
    expect(markup).toContain('<text aria-hidden="true">×</text>')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('aria-label="Confirm"')
    expect(markup).toContain('Confirm ({{selected.length}})')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('bindkeydown="onConfirmKey"')
  })

  it('follows a later value and keeps taps disabled', async () => {
    const host = await hostFor({ value: ['pear'] })
    expect(host.properties.placeholder).toBe('Select an item')
    expect(host.data.selected).toEqual(['pear'])
    expect(host.data.optionStatus).toBe('Option 1 of 2')
    expect(host.data.displayValue).toBe('Pear')
    host.setData({ value: ['pear', 'apple'] })
    expect(host.data.displayValue).toBe('Pear, Apple')
    expect(host.data.optionStatus).toBe('2 options selected')
    host.setData({ value: [] })
    expect(host.data.selected ?? []).toEqual([])
    expect(host.data.optionStatus).toBe('')
    expect(host.data.displayValue).toBe('')

    const disabled = await hostFor({ disabled: true, value: ['pear'] })
    disabled.onTriggerTap()
    disabled.onItemTap(tap('pear'))
    expect(disabled.data.opened).toBe(false)
    expect(disabled.data.selected).toEqual(['pear'])
    disabled.setData({ value: [] })
    expect(disabled.data.selected ?? []).toEqual([])
  })

  it('selects the default item and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: ['pear'] })
    expect(preset.data.selected).toEqual(['pear'])
    expect(preset.data.displayValue).toBe('Pear')

    const held = await hostFor({ value: [], defaultValue: ['pear'] })
    expect(held.data.selected).toEqual([])
    expect(held.data.displayValue).toBe('')
    held.onItemTap(tap('pear'))
    expect(held.data.selected).toEqual([])
  })

  it('moves the highlight, toggles it with Enter, and closes with Escape', async () => {
    const host = await hostFor()
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.opened).toBe(true)
    expect(host.data.highlight).toBe(0)
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.highlight).toBe(1)
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.highlight).toBe(0)
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.highlight).toBe(0)
    expect(host.data.selected ?? []).not.toContain('apple')
    host.onKey({ detail: { key: 'ArrowDown' } })
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.selected ?? []).not.toContain('apple')
    expect(host.data.opened).toBe(true)
    host.onItemKey({ detail: { key: ' ' }, mark: { value: 'pear' } })
    expect(host.data.selected).toContain('pear')
    expect(host.data.opened).toBe(true)
    host.onKey({ detail: { key: 'ArrowUp' } })
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.selected ?? []).not.toContain('pear')
    expect(host.data.opened).toBe(true)
    host.onCloseKey({ detail: { key: 'Enter' } })
    expect(host.data.opened).toBe(false)

    const locked = await hostFor({ disabled: true })
    locked.onKey({ detail: { key: 'ArrowDown' } })
    expect(locked.data.opened).toBe(false)

    const confirm = await hostFor()
    confirm.onKey({ detail: { key: 'Enter' } })
    expect(confirm.data.opened).toBe(true)
    confirm.onConfirmKey({ detail: { key: ' ' } })
    expect(confirm.data.opened).toBe(false)
    expect(confirm.events.at(-1)?.name).toBe('confirm')
  })

  it('opens, selects an option, and ignores a disabled option or a disabled field', async () => {
    const held = await hostFor({ value: [] })
    held.onItemTap(tap('pear'))
    expect(held.data.selected).toEqual([])
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: ['pear'] } })
    held.setProperty('value', ['pear'])
    expect(held.data.selected).toEqual(['pear'])
    expect(held.data.displayValue).toBe('Pear')

    const enabled = await hostFor()
    expect(enabled.data.opened).toBe(false)
    enabled.onTriggerTap()
    expect(enabled.data.opened).toBe(true)
    enabled.onItemTap(tap('pear'))
    expect(enabled.data.selected).toContain('pear')
    expect(enabled.data.displayValue).toBe('Pear')
    enabled.onItemTap(tap('apple'))
    expect(enabled.data.selected).not.toContain('apple')

    const disabled = await hostFor({ disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.onItemTap(tap('pear'))
    expect(disabled.data.selected ?? []).not.toContain('pear')
  })

  it('opens from defaultOpen and follows a later open value', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.opened).toBe(true)

    const held = await hostFor({ open: false, defaultOpen: true })
    expect(held.data.opened).toBe(false)
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
    held.setProperty('open', true)
    expect(held.data.opened).toBe(true)
  })
})
