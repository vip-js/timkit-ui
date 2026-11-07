import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { selected?: string; optionStatus?: string; checked?: boolean }
  methods?: Record<string, (...args: unknown[]) => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

const caches = new Map<string, ComponentDefinition>()

const loadDefinition = async (file: string) => {
  const cached = caches.get(file)
  if (cached) return cached
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, '..', file)).href)
  if (!captured) throw new Error(`${file} was not registered`)
  caches.set(file, captured)
  return captured
}

const hostFor = async (file: string, properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition(file)
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
    getRelationNodes: () => [] as Array<{ properties?: { value?: string }; data: { checked?: boolean }; setData: (update: { checked: boolean }) => void }>,
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host
}

describe('weapp radio group', () => {
  it('exposes a radio group and radio items', () => {
    const group = fs.readFileSync(path.join(__dirname, 'radio-group.wxml'), 'utf8')
    const item = fs.readFileSync(path.join(__dirname, '../radio-group-item/radio-group-item.wxml'), 'utf8')
    expect(group).toContain('role="radiogroup"')
    expect(group).toContain('role="status"')
    expect(group).toContain('aria-orientation="{{orientation}}"')
    expect(group).toContain("aria-required=\"{{required ? 'true' : 'false'}}\"")
    expect(group).toContain("aria-readonly=\"{{readOnly ? 'true' : 'false'}}\"")
    expect(group).toContain("aria-disabled=\"{{api.disabled ? 'true' : 'false'}}\"")
    expect(group).toContain("aria-label=\"{{ariaLabel || 'Radio group'}}\"")
    expect(item).toContain('role="radio"')
    expect(item).toContain('<slot />')
    expect(item).toContain('aria-hidden="true"')
    expect(item).toContain('<text wx:if="{{label}}">{{label}}</text>')
    expect(item).toContain('bindkeydown="onKey"')
    expect(item).toContain("aria-checked=\"{{checked ? 'true' : 'false'}}\"")
    expect(item).toContain('tabindex="{{tabIndex}}"')
    expect(item).toContain("aria-disabled=\"{{disabled || groupDisabled ? 'true' : 'false'}}\"")
  })

  it('follows a later value and ignores a disabled selection', async () => {
    const apple = {
      properties: { value: 'apple' },
      data: { checked: false },
      setData(update: { checked: boolean }) {
        this.data.checked = update.checked
      },
    }
    const pear = {
      properties: { value: 'pear' },
      data: { checked: false },
      setData(update: { checked: boolean }) {
        this.data.checked = update.checked
      },
    }
    const host = await hostFor('radio-group/radio-group.ts', { disabled: true })
    host.getRelationNodes = () => [apple, pear]
    host.handleChildChange('apple')
    expect(host.data.selected).toBe('')
    expect(apple.data.checked).toBe(false)
    host.setProperty('value', 'pear')
    expect(host.data.selected).toBe('pear')
    expect(host.data.optionStatus).toBe('Option 2 of 2')
    expect(pear.data.checked).toBe(true)
    host.setProperty('value', '')
    expect(host.data.selected).toBe('')
    expect(host.data.optionStatus).toBe('')
    expect(pear.data.checked).toBe(false)
  })

  it('selects the default item and stays empty when the value is empty', async () => {
    const preset = await hostFor('radio-group/radio-group.ts', { defaultValue: 'pear' })
    expect(preset.data.selected).toBe('pear')

    const held = await hostFor('radio-group/radio-group.ts', { value: '', defaultValue: 'pear' })
    expect(held.data.selected).toBe('')
    held.handleChildChange('pear')
    expect(held.data.selected).toBe('')
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: 'pear' } })
  })

  it('selects one value and replaces it with the next', async () => {
    const host = await hostFor('radio-group/radio-group.ts')
    const apple = { properties: { value: 'apple' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    const pear = { properties: { value: 'pear' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    host.getRelationNodes = () => [apple, pear]

    host.handleChildChange('apple')
    expect(host.data.selected).toBe('apple')
    expect(host.data.control?.selected).toBe('apple')
    expect(apple.data.checked).toBe(true)
    expect(pear.data.checked).toBe(false)

    host.handleChildChange('pear')
    expect(host.data.selected).toBe('pear')
    expect(apple.data.checked).toBe(false)
    expect(pear.data.checked).toBe(true)

    const heldApple = { properties: { value: 'apple' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    const heldPear = { properties: { value: 'pear' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    const held = await hostFor('radio-group/radio-group.ts', { value: 'apple' })
    held.getRelationNodes = () => [heldApple, heldPear]
    held.handleChildChange('pear')
    expect(held.data.selected).toBe('apple')
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: 'pear' } })
    held.setProperty('value', 'pear')
    expect(held.data.selected).toBe('pear')
    expect(heldPear.data.checked).toBe(true)
  })

  it('keeps one radio in the tab order', async () => {
    const host = await hostFor('radio-group/radio-group.ts')
    const apple = {
      properties: { value: 'apple', disabled: true },
      data: { checked: false, tabIndex: 0 },
      setData(update: { checked: boolean; tabIndex: number }) {
        Object.assign(this.data, update)
      },
    }
    const pear = {
      properties: { value: 'pear', disabled: false },
      data: { checked: false, tabIndex: 0 },
      setData(update: { checked: boolean; tabIndex: number }) {
        Object.assign(this.data, update)
      },
    }
    host.getRelationNodes = () => [apple, pear]
    host.syncItems?.('')
    expect(apple.data.tabIndex).toBe(-1)
    expect(pear.data.tabIndex).toBe(0)
    host.syncItems?.('pear')
    expect(pear.data.checked).toBe(true)
    expect(pear.data.tabIndex).toBe(0)
    expect(apple.data.tabIndex).toBe(-1)
    host.syncItems?.('apple')
    expect(apple.data.checked).toBe(true)
    expect(apple.data.tabIndex).toBe(-1)
    expect(pear.data.tabIndex).toBe(0)
    host.properties.disabled = true
    host.syncItems?.('pear')
    expect(pear.data.checked).toBe(true)
    expect(apple.data.tabIndex).toBe(-1)
    expect(pear.data.tabIndex).toBe(-1)
    expect(apple.data.groupDisabled).toBe(true)
    expect(pear.data.groupDisabled).toBe(true)
  })

  it('ignores a selection while disabled', async () => {
    const host = await hostFor('radio-group/radio-group.ts', { disabled: true })
    const apple = { properties: { value: 'apple' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    host.getRelationNodes = () => [apple]
    host.handleChildChange('apple')
    expect(host.data.selected).toBe('')
    expect(host.data.control?.selected).toBe('')
    expect(apple.data.checked).toBe(false)
  })

  it('ignores a selection while read-only and still follows a later value', async () => {
    const host = await hostFor('radio-group/radio-group.ts', { readOnly: true, value: 'apple' })
    const apple = { properties: { value: 'apple' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    const pear = { properties: { value: 'pear' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    host.getRelationNodes = () => [apple, pear]
    host.syncItems?.(host.data.selected)
    expect(host.data.selected).toBe('apple')
    host.handleChildChange('pear')
    expect(host.data.selected).toBe('apple')
    expect(host.events).toEqual([])
    host.setProperty('value', 'pear')
    expect(host.data.selected).toBe('pear')
  })

  it('item tap selects through the group and a disabled item does not', async () => {
    const item = await loadDefinition('radio-group-item/radio-group-item.ts')
    const chosen: string[] = []
    const parent = {
      properties: { disabled: false },
      handleChildChange(value: string) {
        chosen.push(value)
      },
    }
    const data = { ...(item.data ?? {}) }
    const host = {
      properties: { value: 'apple', disabled: false, invalid: false, extClass: '' },
      data,
      setData(update: Record<string, unknown>) {
        Object.assign(data, update)
      },
      getRelationNodes: () => [parent],
    }
    Object.assign(host, item.methods ?? {})
    host.onKey({ detail: { key: 'Enter' } })
    expect(chosen).toEqual(['apple'])

    host.properties.disabled = true
    host.onKey({ detail: { key: ' ' } })
    expect(chosen).toEqual(['apple'])

    host.properties.disabled = false
    parent.properties.disabled = true
    host.handleTap()
    expect(chosen).toEqual(['apple'])
  })

  it('moves with the vertical arrows and skips a disabled item', async () => {
    const host = await hostFor('radio-group/radio-group.ts', { value: 'apple' })
    const apple = { properties: { value: 'apple', disabled: false }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    const locked = { properties: { value: 'locked', disabled: true }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    const pear = { properties: { value: 'pear', disabled: false }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    host.getRelationNodes = () => [apple, locked, pear]
    host.onItemKey('apple', 'ArrowRight')
    expect(host.data.selected).toBe('apple')
    expect(host.events).toEqual([])
    host.onItemKey('apple', 'ArrowDown')
    expect(host.data.selected).toBe('apple')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: 'pear' } })

    const horizontal = await hostFor('radio-group/radio-group.ts')
    const first = { properties: { value: 'apple' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    const second = { properties: { value: 'pear' }, data: { checked: false }, setData(update: { checked: boolean }) { this.data.checked = update.checked } }
    horizontal.getRelationNodes = () => [first, second]
    horizontal.setProperty('orientation', 'horizontal')
    horizontal.onItemKey('apple', 'ArrowDown')
    expect(horizontal.data.selected).toBe('')
    horizontal.onItemKey('apple', 'ArrowRight')
    expect(horizontal.data.selected).toBe('pear')

    const lockedGroup = await hostFor('radio-group/radio-group.ts', { readOnly: true, value: 'apple' })
    lockedGroup.getRelationNodes = () => [first, second]
    lockedGroup.onItemKey('apple', 'ArrowDown')
    expect(lockedGroup.data.selected).toBe('apple')
    expect(lockedGroup.events).toEqual([])
  })

  it('selects the next enabled item whose value starts with a letter', async () => {
    const item = (value: string, disabled = false) => ({
      properties: { value, disabled },
      data: { checked: false },
      setData(update: { checked: boolean }) {
        this.data.checked = update.checked
      },
    })
    const host = await hostFor('radio-group/radio-group.ts')
    host.getRelationNodes = () => [item('apple', true), item('pear'), item('plum'), item('peach')]
    host.onItemKey('apple', 'p')
    expect(host.data.selected).toBe('pear')
    host.onItemKey('pear', 'p')
    expect(host.data.selected).toBe('plum')
    host.onItemKey('plum', 'p')
    expect(host.data.selected).toBe('peach')
    host.onItemKey('peach', 'z')
    expect(host.data.selected).toBe('peach')

    const frozen = await hostFor('radio-group/radio-group.ts', { readOnly: true })
    frozen.getRelationNodes = () => [item('pear')]
    frozen.onItemKey('pear', 'p')
    expect(frozen.data.selected).toBe('')
    expect(frozen.events).toEqual([])

    const disabled = await hostFor('radio-group/radio-group.ts', { disabled: true })
    disabled.getRelationNodes = () => [item('pear')]
    disabled.onItemKey('pear', 'p')
    expect(disabled.data.selected).toBe('')
  })

  it('uses a passed accessible name and leaves an omitted name empty', async () => {
    const named = await hostFor('radio-group/radio-group.ts', { 'aria-label': 'Fruit' })
    expect(named.data.ariaLabel).toBe('Fruit')
    const plain = await hostFor('radio-group/radio-group.ts')
    expect(plain.data.ariaLabel).toBe('')
    plain.setProperty('aria-label', 'Size')
    expect(plain.data.ariaLabel).toBe('Size')
  })

  it('is vertical unless orientation is horizontal', async () => {
    const vertical = await hostFor('radio-group/radio-group.ts')
    expect((vertical.data as { orientation?: string }).orientation).toBe('vertical')
    const horizontal = await hostFor('radio-group/radio-group.ts', { orientation: 'horizontal' })
    expect((horizontal.data as { orientation?: string }).orientation).toBe('horizontal')
  })
})
