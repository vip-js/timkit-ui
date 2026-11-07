import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { on?: boolean; radioValue?: string }
  methods?: Record<string, (...args: unknown[]) => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

const load = async (file: string) => {
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(file).href)
  if (!captured) throw new Error(`component was not registered: ${file}`)
  return captured
}

const hostFor = (definition: ComponentDefinition, properties: Record<string, unknown> = {}) => {
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
    triggerEvent() {},
    getRelationNodes() {
      return []
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onToggle: () => void
    onSelect: () => void
    setChecked: (on: boolean) => void
    selectRadio: (value: string) => void
    setProperty: (key: string, value: unknown) => void
  }
}

describe('weapp dropdown menu items', () => {
  it('exposes a checkbox menu item', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'dropdown-menu-checkbox-item.wxml'), 'utf8')
    expect(markup).toContain('role="menuitemcheckbox"')
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain("tabindex=\"{{active && !disabled ? 0 : -1}}\"")
    expect(markup).toContain("aria-checked=\"{{on ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('bindkeydown="onKey"')
  })

  it('toggles a checkbox and replaces the radio selection', async () => {
    const checkbox = await load(path.join(__dirname, 'dropdown-menu-checkbox-item.ts'))
    const enabled = hostFor(checkbox)
    enabled.onToggle()
    expect(enabled.data.on).toBe(true)
    enabled.onToggle()
    expect(enabled.data.on).toBe(false)
    const disabled = hostFor(checkbox, { disabled: true })
    disabled.onToggle()
    expect(disabled.data.on).toBe(false)
    disabled.setProperty('checked', true)
    expect(disabled.data.on).toBe(true)
    disabled.setProperty('checked', false)
    expect(disabled.data.on).toBe(false)
    const events: Array<{ detail?: { detail?: { checked?: boolean } } }> = []
    const held = hostFor(checkbox, { checked: false })
    held.triggerEvent = (_name: string, payload: { detail?: { checked?: boolean } }) => {
      events.push({ detail: payload })
    }
    held.onToggle()
    expect(held.data.on).toBe(false)
    expect(events.at(-1)?.detail?.detail?.checked).toBe(true)

    const radio = await load(path.join(__dirname, '../dropdown-menu-radio-item/dropdown-menu-radio-item.ts'))
    const menu = await load(path.join(__dirname, '../dropdown-menu/dropdown-menu.ts'))
    const apple = hostFor(radio, { value: 'apple', closeOnSelect: false })
    const pear = hostFor(radio, { value: 'pear', closeOnSelect: false })
    const plum = hostFor(radio, { value: 'plum', disabled: true, closeOnSelect: false })
    const parent = hostFor(menu)
    parent.getRelationNodes = () => [apple, pear, plum]
    for (const item of [apple, pear, plum]) item.getRelationNodes = () => [parent]
    apple.onSelect()
    expect(parent.data.radioValue).toBe('apple')
    expect(apple.data.on).toBe(true)
    expect(pear.data.on).toBe(false)
    pear.onSelect()
    expect(parent.data.radioValue).toBe('pear')
    expect(apple.data.on).toBe(false)
    expect(pear.data.on).toBe(true)
    plum.onSelect()
    expect(parent.data.radioValue).toBe('pear')
    expect(plum.data.on).toBe(false)
    plum.setProperty('checked', true)
    expect(plum.data.on).toBe(true)

    const closed = { closed: false, close() { this.closed = true } }
    const box = hostFor(checkbox)
    box.getRelationNodes = () => [closed]
    box.onKey({ detail: { key: 'Enter' } })
    expect(box.data.on).toBe(true)
    box.onKey({ detail: { key: 'Escape' } })
    expect(closed.closed).toBe(true)
    const item = await load(path.join(__dirname, '../dropdown-menu-item/dropdown-menu-item.ts'))
    const row = hostFor(item)
    const closer = { closed: false, close() { this.closed = true } }
    row.getRelationNodes = () => [closer]
    row.onKey({ detail: { key: ' ' } })
    expect(closer.closed).toBe(true)
    const locked = hostFor(item, { disabled: true })
    locked.getRelationNodes = () => [closer]
    closer.closed = false
    locked.onKey({ detail: { key: 'Enter' } })
    expect(closer.closed).toBe(false)
  })
})
