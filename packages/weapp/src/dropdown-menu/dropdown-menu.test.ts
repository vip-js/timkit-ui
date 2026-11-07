import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { opened?: boolean; highlight?: number; itemStatus?: string; api?: { open?: boolean; setOpen?: (open: boolean) => void } }
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
  await import(pathToFileURL(path.join(__dirname, 'dropdown-menu.ts')).href)
  if (!captured) throw new Error('dropdown menu was not registered')
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
    getRelationNodes() {
      return []
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onTriggerTap: () => void
    onKey: (event?: { detail?: { key?: string } }) => void
    paintHighlight: (index: number) => void
    _items?: Array<{ properties?: { disabled?: boolean }; setActive?: (on: boolean) => void; activate?: () => void }>
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { open?: boolean } }>
  }
}

describe('weapp dropdown menu', () => {
  it('exposes a menu button and menu items', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'dropdown-menu.wxml'), 'utf8')
    const radio = fs.readFileSync(path.join(__dirname, '../dropdown-menu-radio-item/dropdown-menu-radio-item.wxml'), 'utf8')
    expect(markup).toContain('role="button"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('aria-haspopup="menu"')
    expect(markup).toContain('wx:if="{{api.open}}"')
    expect(markup).toContain('aria-controls="{{id}}-menu"')
    expect(markup.split('wx:else')[1].split('dropdown-backdrop')[0]).not.toContain('aria-controls')
    expect(markup).toContain('id="{{id}}-trigger"')
    expect(markup).toContain('role="menu"')
    expect(markup).toContain('tabindex="0"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('aria-labelledby="{{id}}-trigger"')
    expect(markup).toContain('bindkeydown="onKey"')
    const item = fs.readFileSync(path.join(__dirname, '../dropdown-menu-item/dropdown-menu-item.wxml'), 'utf8')
    expect(item).toContain('role="menuitem"')
    const shortcut = fs.readFileSync(path.join(__dirname, '../dropdown-menu-shortcut/dropdown-menu-shortcut.wxml'), 'utf8')
    expect(shortcut).toContain('data-slot="dropdown-menu-shortcut"')
    expect(shortcut).toContain('aria-hidden="true"')
    expect(item).toContain("tabindex=\"{{active && !disabled ? 0 : -1}}\"")
    expect(item).toContain('bindkeydown="onKey"')
    expect(radio).toContain('bindkeydown="onKey"')
    expect(radio).toContain('role="menuitemradio"')
    expect(radio).toContain('aria-hidden="true"')
    expect(radio).toContain("tabindex=\"{{active && !disabled ? 0 : -1}}\"")
    expect(radio).toContain("aria-checked=\"{{on ? 'true' : 'false'}}\"")
  })

  it('starts open from the default and stays shut when open is false', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.opened).toBe(true)
    preset.onBackdropTap()
    expect(preset.data.opened).toBe(false)

    const held = await hostFor({ open: false, defaultOpen: true })
    expect(held.data.opened).toBe(false)
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
  })

  it('follows a later open value and ignores a disabled trigger', async () => {
    const host = await hostFor()
    expect(host.data.opened).toBe(false)
    host.setData({ open: true })
    expect(host.data.opened).toBe(true)
    expect(host.data.api?.open).toBe(true)
    host.setData({ open: false })
    expect(host.data.opened).toBe(false)

    const held = await hostFor({ open: false })
    held.onTriggerTap()
    expect(held.data.opened).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { open: true } })
    held.setProperty('open', true)
    expect(held.data.opened).toBe(true)

    const radio = await hostFor({ defaultValue: 'pear' })
    expect(radio.data.radioValue).toBe('pear')
    const heldRadio = await hostFor({ value: '', defaultValue: 'pear' })
    expect(heldRadio.data.radioValue).toBe('')
    const apple = { properties: { value: 'apple' }, on: false, setChecked(on: boolean) { this.on = on } }
    heldRadio.getRelationNodes = () => [apple]
    ;(heldRadio as { selectRadio: (value: string) => void }).selectRadio('apple')
    expect(heldRadio.data.radioValue).toBe('')
    expect(apple.on).toBe(false)
    expect(heldRadio.events.at(-1)).toEqual({ name: 'radioChange', detail: { value: 'apple' } })
    heldRadio.setProperty('value', 'apple')
    expect(heldRadio.data.radioValue).toBe('apple')
    expect(apple.on).toBe(true)

    const first = { properties: {}, active: false, selected: false, setActive(on: boolean) { this.active = on }, activate() { this.selected = true } }
    const lockedItem = { properties: { disabled: true }, active: false, selected: false, setActive(on: boolean) { this.active = on }, activate() { this.selected = true } }
    const third = { properties: {}, active: false, selected: false, setActive(on: boolean) { this.active = on }, activate() { this.selected = true } }
    const keys = await hostFor()
    keys._items = [first, lockedItem, third]
    keys.onKey({ detail: { key: 'Home' } })
    expect(keys.data.opened).toBe(false)
    keys.onKey({ detail: { key: 'ArrowDown' } })
    expect(keys.data.opened).toBe(true)
    expect(keys.data.highlight).toBe(0)
    expect(first.active).toBe(true)
    keys.onKey({ detail: { key: 'ArrowDown' } })
    expect(keys.data.highlight).toBe(2)
    expect(lockedItem.active).toBe(false)
    expect(third.active).toBe(true)
    keys.onKey({ detail: { key: 'End' } })
    expect(keys.data.highlight).toBe(2)
    expect(first.selected).toBe(false)
    keys.onKey({ detail: { key: 'Home' } })
    expect(keys.data.highlight).toBe(0)
    expect(first.active).toBe(true)
    expect(lockedItem.active).toBe(false)
    keys.onKey({ detail: { key: 'Enter' } })
    expect(first.selected).toBe(true)
    expect(third.selected).toBe(false)
    expect(lockedItem.selected).toBe(false)
    keys.paintHighlight(1)
    keys.onKey({ detail: { key: 'Enter' } })
    expect(lockedItem.selected).toBe(false)
    keys.onKey({ detail: { key: 'Escape' } })
    expect(keys.data.opened).toBe(false)
    const locked = await hostFor({ disabled: true })
    locked.onKey({ detail: { key: 'ArrowDown' } })
    expect(locked.data.opened).toBe(false)

    const disabled = await hostFor({ disabled: true })
    disabled.onTriggerTap()
    expect(disabled.data.opened).toBe(false)
    disabled.setData({ open: true })
    expect(disabled.data.opened).toBe(true)
  })

  it('moves to the next enabled item whose label starts with a letter without selecting it', async () => {
    const item = (label: string, disabled = false) => ({
      properties: { label, disabled, value: label.toLowerCase() },
      active: false,
      selected: false,
      setActive(on: boolean) {
        this.active = on
      },
      activate() {
        this.selected = true
      },
    })
    const pear = item('Pear')
    const apple = item('Apple', true)
    const plum = item('Plum')
    const peach = item('Peach')
    const host = await hostFor()
    host._items = [pear, apple, plum, peach]
    host.setData({ opened: true })
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(0)
    expect(host.data.itemStatus).toBe('Item 1 of 4')
    expect(pear.active).toBe(true)
    expect(pear.selected).toBe(false)
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(2)
    expect(host.data.itemStatus).toBe('Item 3 of 4')
    expect(plum.active).toBe(true)
    expect(apple.active).toBe(false)
    host.onKey({ detail: { key: 'p' } })
    expect(host.data.highlight).toBe(3)
    host.onKey({ detail: { key: 'z' } })
    expect(host.data.highlight).toBe(3)
    expect(peach.selected).toBe(false)
    expect(host.data.opened).toBe(true)

    const closed = await hostFor()
    closed._items = [item('Pear')]
    closed.onKey({ detail: { key: 'p' } })
    expect(closed.data.opened).toBe(false)
    expect(closed.data.itemStatus ?? '').toBe('')

    const locked = await hostFor({ disabled: true })
    locked._items = [item('Pear')]
    locked.setData({ opened: true })
    locked.onKey({ detail: { key: 'p' } })
    expect(locked.data.highlight).toBe(0)
    expect(locked._items[0]?.active).toBe(false)
  })
})
