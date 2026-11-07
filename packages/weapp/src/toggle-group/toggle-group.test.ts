import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { selected?: string[]; itemStatus?: string }
  methods?: Record<string, (event?: { currentTarget?: { dataset?: Record<string, string | boolean> } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'toggle-group.ts')).href)
  if (!captured) throw new Error('toggle group was not registered')
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
    events: [] as Array<{ name: string; detail?: { value?: string[] } }>,
    triggerEvent(name: string, detail?: { value?: string[] }) {
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
    onItemTap: (event?: { currentTarget?: { dataset?: Record<string, string | boolean> } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string[] } }>
  }
}

const tap = (value: string, extra: Record<string, string | boolean> = {}) => ({
  currentTarget: { dataset: { value, ...extra } },
})

describe('weapp toggle group', () => {
  it('follows a later value and ignores taps while disabled', async () => {
    const host = await hostFor({ value: ['bold'] })
    expect(host.data.selected).toEqual(['bold'])
    ;(host as { getRelationNodes?: () => unknown[] }).getRelationNodes = () => [
      { properties: { value: 'bold' } },
      { properties: { value: 'italic' } },
    ]
    host.setProperty('value', ['italic'])
    expect(host.data.selected).toEqual(['italic'])
    expect(host.data.itemStatus).toBe('Item 2 of 2')
    host.onItemTap(tap('bold'))
    expect(host.data.selected).toEqual(['italic'])
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: ['bold'] } })
    host.setProperty('value', ['bold'])
    expect(host.data.selected).toEqual(['bold'])
    expect(host.data.itemStatus).toBe('Item 1 of 2')
    const many = await hostFor({ multiple: true, value: ['bold'] })
    ;(many as { getRelationNodes?: () => unknown[] }).getRelationNodes = () => [
      { properties: { value: 'bold' } },
      { properties: { value: 'italic' } },
    ]
    many.setProperty('value', ['bold', 'italic'])
    expect(many.data.itemStatus).toBe('2 items pressed')
    many.setProperty('value', [])
    expect(many.data.itemStatus).toBe('')

    const disabled = await hostFor({ disabled: true, value: ['bold'] })
    disabled.onItemTap(tap('italic'))
    expect(disabled.data.selected).toEqual(['bold'])
    disabled.setProperty('value', [])
    expect(disabled.data.selected).toEqual([])
  })

  it('selects the default item and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: ['bold'] })
    expect(preset.data.selected).toEqual(['bold'])

    const held = await hostFor({ value: [], defaultValue: ['bold'] })
    expect(held.data.selected).toEqual([])
    held.onItemTap(tap('bold'))
    expect(held.data.selected).toEqual([])
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: ['bold'] } })
  })

  it('selects one item, ignores a disabled item, and ignores a disabled group', async () => {
    const enabled = await hostFor()
    enabled.onItemTap(tap('bold'))
    expect(enabled.data.selected).toEqual(['bold'])
    enabled.onItemTap(tap('italic'))
    expect(enabled.data.selected).toEqual(['italic'])
    enabled.onItemTap(tap('locked', { disabled: true }))
    expect(enabled.data.selected).toEqual(['italic'])

    const disabled = await hostFor({ disabled: true })
    disabled.onItemTap(tap('bold'))
    expect(disabled.data.selected).toEqual([])
  })

  it('marks the selected item pressed', async () => {
    const host = await hostFor({ value: ['bold'] })
    const bold = {
      properties: { value: 'bold' },
      data: { pressed: false },
      setData(update: { pressed: boolean }) {
        this.data.pressed = update.pressed
      },
    }
    const italic = {
      properties: { value: 'italic' },
      data: { pressed: false },
      setData(update: { pressed: boolean }) {
        this.data.pressed = update.pressed
      },
    }
    host.getRelationNodes = () => [bold, italic]
    host.syncItems()
    expect(bold.data.pressed).toBe(true)
    expect(italic.data.pressed).toBe(false)
  })

  it('item Enter toggles through the group and a disabled item does not', async () => {
    const markup = fs.readFileSync(path.join(__dirname, '../toggle-group-item/toggle-group-item.wxml'), 'utf8')
    expect(markup).toContain('role="radio"')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('tabindex="{{disabled || groupDisabled || !tabbable ? -1 : 0}}"')
    expect(markup).toContain("aria-disabled=\"{{disabled || groupDisabled ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-pressed=\"{{pressed ? 'true' : 'false'}}\"")
    expect(markup).toContain('bindkeydown="onKey"')

    let captured: ComponentDefinition | null = null
    ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
      captured = definition
    }
    await import(pathToFileURL(path.join(__dirname, '../toggle-group-item/toggle-group-item.ts')).href)
    if (!captured) throw new Error('toggle group item was not registered')
    const item = captured as ComponentDefinition
    const chosen: string[] = []
    const parent = {
      properties: { disabled: false },
      onItemTap(event?: { currentTarget?: { dataset?: { value?: string } } }) {
        chosen.push(String(event?.currentTarget?.dataset?.value || ''))
      },
    }
    const host = {
      properties: { value: 'bold', disabled: false, extClass: '' },
      data: { ...(item.data ?? {}) },
      setData(update: Record<string, unknown>) {
        Object.assign(host.data, update)
      },
      getRelationNodes: () => [parent],
    }
    Object.assign(host, item.methods ?? {})
    host.onKey({ detail: { key: 'Enter' } })
    expect(chosen).toEqual(['bold'])

    host.properties.disabled = true
    host.onKey({ detail: { key: ' ' } })
    expect(chosen).toEqual(['bold'])

    const moved: string[] = []
    parent.onItemKey = (event) => moved.push(String(event.value || ''))
    host.properties.disabled = false
    host.onKey({ detail: { key: 'ArrowRight' } })
    expect(moved).toEqual(['bold'])
    expect(chosen).toEqual(['bold'])
  })

  it('moves across enabled items with ArrowRight and does not press them', async () => {
    const groupMarkup = fs.readFileSync(path.join(__dirname, 'toggle-group.wxml'), 'utf8')
    expect(groupMarkup).toContain("role=\"{{multiple ? 'group' : 'radiogroup'}}\"")
    expect(groupMarkup).toContain("aria-label=\"{{ariaLabel || 'Toggle group'}}\"")
    expect(groupMarkup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    const named = await hostFor({ 'aria-label': 'Format' })
    expect(named.data.ariaLabel).toBe('Format')
    named.setProperty('aria-label', '')
    expect(named.data.ariaLabel).toBe('')

    const host = await hostFor()
    const nodes = [
      { properties: { value: 'bold', disabled: false }, data: {} as Record<string, unknown>, setData(update: Record<string, unknown>) { Object.assign(this.data, update) } },
      { properties: { value: 'locked', disabled: true }, data: {} as Record<string, unknown>, setData(update: Record<string, unknown>) { Object.assign(this.data, update) } },
      { properties: { value: 'italic', disabled: false }, data: {} as Record<string, unknown>, setData(update: Record<string, unknown>) { Object.assign(this.data, update) } },
    ]
    host.getRelationNodes = () => nodes
    host.onItemKey({ value: 'bold', detail: { key: 'ArrowRight' } })
    expect(host.data.focusValue).toBe('italic')
    expect(host.data.selected).toEqual([])
    expect(nodes[2].data.tabbable).toBe(true)
    expect(nodes[0].data.tabbable).toBe(false)
    expect(nodes[0].data.itemRole).toBe('radio')
    host.onItemKey({ value: 'italic', detail: { key: 'ArrowRight' } })
    expect(host.data.focusValue).toBe('bold')

    const edge = await hostFor({ loop: false })
    edge.getRelationNodes = () => nodes
    edge.onItemKey({ value: 'italic', detail: { key: 'ArrowRight' } })
    expect(edge.data.focusValue).toBe('italic')

    const disabled = await hostFor({ disabled: true })
    disabled.getRelationNodes = () => nodes
    ;(disabled as { syncItems?: () => void }).syncItems?.()
    expect(nodes[0].data.groupDisabled).toBe(true)
    expect(nodes[0].data.tabbable).toBe(false)
    expect(nodes[1].data.tabbable).toBe(false)
    expect(nodes[2].data.tabbable).toBe(false)
    disabled.onItemKey({ value: 'bold', detail: { key: 'ArrowRight' } })
    expect(disabled.data.focusValue).toBe('')
  })
})
