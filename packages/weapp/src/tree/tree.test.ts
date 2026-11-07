import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { flatNodes?: Array<{ id: string }>; selected?: string; nodeStatus?: string }
  methods?: Record<string, (event?: { currentTarget?: { dataset?: { id?: string } } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'tree.ts')).href)
  if (!captured) throw new Error('tree component was not registered')
  definitionCache = captured
  return definitionCache
}

const nodes = [{ id: 'a', label: 'Parent', children: [{ id: 'b', label: 'Child' }] }]

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
    events: [] as Array<{ name: string; detail?: { id?: string } }>,
    triggerEvent(name: string, detail?: { id?: string }) {
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
    onToggle: (event?: { currentTarget?: { dataset?: { id?: string } } }) => void
    onSelect: (event?: { currentTarget?: { dataset?: { id?: string } } }) => void
    onToggleKey: (event?: { detail?: { key?: string }; currentTarget?: { dataset?: { id?: string } } }) => void
    onSelectKey: (event?: { detail?: { key?: string }; currentTarget?: { dataset?: { id?: string } } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { id?: string } }>
  }
}

const ids = (host: { data: { flatNodes?: Array<{ id: string }> } }) =>
  (host.data.flatNodes ?? []).map((node) => node.id)

describe('weapp tree', () => {
  it('exposes a tree of items', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'tree.wxml'), 'utf8')
    expect(markup).toContain('role="tree"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Tree'}}\"")
    expect(markup).not.toContain("aria-label=\"{{labelledBy ? '' : (ariaLabel || 'Tree')}}\"")
    expect(markup).toContain('role="treeitem"')
    expect(markup.match(/role="treeitem"\n      aria-disabled="\{\{disabled \? 'true' : 'false'\}\}"/g)).toHaveLength(4)
    expect(markup).toContain('aria-label="{{item.label}}"')
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain("tabindex=\"{{disabled || item.id !== focusId ? -1 : 0}}\"")
    expect(markup).toContain("aria-selected=\"{{selected === item.id ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-expanded=\"{{expandedMap[item.id] ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-label=\"{{expandedMap[item.id] ? 'Collapse' : 'Expand'}}\"")
    expect(markup).toContain('<text aria-hidden="true">{{expandedMap[item.id] ? \'▾\' : \'▸\'}}</text>')
    expect(markup).toContain('bindkeydown="onToggleKey"')
    expect(markup).toContain('bindkeydown="onSelectKey"')
    expect(markup).toContain('padding-left: {{item.pad}}px;')
    expect(markup).not.toContain('24rpx')
    const named = await hostFor({ 'aria-label': 'Files', 'aria-labelledby': 'tree-title' })
    expect(named.data.ariaLabel).toBe('Files')
    expect(named.data.labelledBy).toBe('tree-title')
    named.setProperty('aria-labelledby', '')
    expect(named.data.labelledBy).toBe('')
  })

  it('follows a later selected node and ignores taps while disabled', async () => {
    const host = await hostFor({ nodes, selected: 'a' })
    expect(host.data.selected).toBe('a')
    expect(host.data.nodeStatus).toBe('Node 1 of 1')
    host.onSelect({ currentTarget: { dataset: { id: 'b' } } })
    expect(host.data.selected).toBe('a')
    expect(host.events.at(-1)?.detail?.id).toBe('b')
    host.setProperty('selected', 'b')
    expect(host.data.selected).toBe('b')
    expect(host.data.nodeStatus).toBe('')
    host.setProperty('selected', '')
    expect(host.data.selected).toBe('')
    expect(host.data.nodeStatus).toBe('')
    host.onSelect({ currentTarget: { dataset: { id: 'a' } } })
    expect(host.data.selected).toBe('')

    const disabled = await hostFor({ nodes, disabled: true, selected: 'a' })
    disabled.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    disabled.onSelect({ currentTarget: { dataset: { id: 'a' } } })
    expect(ids(disabled)).toEqual(['a'])
    expect(disabled.data.selected).toBe('a')
    disabled.setProperty('selected', '')
    expect(disabled.data.selected).toBe('')
  })

  it('selects and expands the defaults and stays shut when both are empty', async () => {
    const preset = await hostFor({ nodes, defaultSelected: 'b', defaultExpandedKeys: ['a'] })
    expect(preset.data.selected).toBe('b')
    expect(ids(preset)).toEqual(['a', 'b'])
    expect(preset.data.nodeStatus).toBe('Node 2 of 2')

    const held = await hostFor({
      nodes,
      selected: '',
      expandedKeys: [],
      defaultSelected: 'b',
      defaultExpandedKeys: ['a'],
    })
    expect(held.data.selected).toBe('')
    expect(ids(held)).toEqual(['a'])
    held.onSelect({ currentTarget: { dataset: { id: 'a' } } })
    expect(held.data.selected).toBe('')
    held.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    expect(ids(held)).toEqual(['a'])
  })

  it('expands one branch, selects a node, and ignores both while disabled', async () => {
    const held = await hostFor({ nodes, expandedKeys: [] })
    held.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    expect(ids(held)).toEqual(['a'])
    expect(held.events.at(-1)).toEqual({ name: 'update:expandedKeys', detail: ['a'] })
    held.setProperty('expandedKeys', ['a'])
    expect(ids(held)).toEqual(['a', 'b'])

    const enabled = await hostFor({ nodes })
    expect(ids(enabled)).toEqual(['a'])
    enabled.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    expect(ids(enabled)).toEqual(['a', 'b'])
    enabled.syncData()
    expect(ids(enabled)).toEqual(['a', 'b'])
    enabled.onSelect({ currentTarget: { dataset: { id: 'b' } } })
    expect(enabled.data.selected).toBe('b')
    enabled.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    expect(ids(enabled)).toEqual(['a'])

    const fromData = await hostFor({ data: nodes })
    expect(ids(fromData)).toEqual(['a'])
    fromData.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    expect(ids(fromData)).toEqual(['a', 'b'])

    const disabled = await hostFor({ nodes, disabled: true })
    disabled.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    expect(ids(disabled)).toEqual(['a'])
    disabled.onSelect({ currentTarget: { dataset: { id: 'a' } } })
    expect(disabled.data.selected).toBe('')
  })

  it('expands and selects from Enter or Space without mixing the two', async () => {
    const host = await hostFor({ nodes })
    host.onToggleKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { id: 'a' } } })
    expect(ids(host)).toEqual(['a', 'b'])
    expect(host.data.selected).toBe('')
    host.onSelectKey({ detail: { key: ' ' }, currentTarget: { dataset: { id: 'b' } } })
    expect(host.data.selected).toBe('b')
    const disabled = await hostFor({ nodes, disabled: true })
    disabled.onToggleKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { id: 'a' } } })
    expect(ids(disabled)).toEqual(['a'])
  })

  it('moves through visible rows with the arrow keys', async () => {
    const host = await hostFor({ nodes })
    expect(host.data.focusId).toBe('a')
    host.onSelectKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { id: 'a' } } })
    expect(ids(host)).toEqual(['a', 'b'])
    expect(host.data.focusId).toBe('a')
    host.onSelectKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { id: 'a' } } })
    expect(host.data.focusId).toBe('b')
    host.onSelectKey({ detail: { key: 'ArrowLeft' }, currentTarget: { dataset: { id: 'b' } } })
    expect(host.data.focusId).toBe('a')
    host.onSelectKey({ detail: { key: 'ArrowLeft' }, currentTarget: { dataset: { id: 'a' } } })
    expect(ids(host)).toEqual(['a'])
    const disabled = await hostFor({ nodes, disabled: true })
    disabled.onSelectKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { id: 'a' } } })
    expect(ids(disabled)).toEqual(['a'])
  })

  it('moves to the first and last visible row with Home and End without opening a branch', async () => {
    const rows = [
      { id: 'a', label: 'Parent', children: [{ id: 'b', label: 'Child' }] },
      { id: 'c', label: 'Sibling' },
    ]
    const host = await hostFor({ nodes: rows })
    expect(host.data.focusId).toBe('a')
    expect(ids(host)).toEqual(['a', 'c'])
    host.onSelectKey({ detail: { key: 'End' }, currentTarget: { dataset: { id: 'a' } } })
    expect(host.data.focusId).toBe('c')
    expect(host.data.selected).toBe('')
    expect(ids(host)).toEqual(['a', 'c'])
    host.onSelectKey({ detail: { key: 'Home' }, currentTarget: { dataset: { id: 'c' } } })
    expect(host.data.focusId).toBe('a')
    expect(ids(host)).toEqual(['a', 'c'])

    const disabled = await hostFor({ nodes: rows, disabled: true })
    disabled.onSelectKey({ detail: { key: 'End' }, currentTarget: { dataset: { id: 'a' } } })
    expect(disabled.data.focusId).toBe('a')
    expect(ids(disabled)).toEqual(['a', 'c'])
  })

  it('moves to the next visible row whose label starts with a letter without selecting it', async () => {
    const rows = [
      { id: 'parent', label: 'Parent', children: [{ id: 'child', label: 'Pear' }] },
      { id: 'plum', label: 'Plum' },
      { id: 'peach', label: 'Peach' },
    ]
    const host = await hostFor({ nodes: rows })
    expect(host.data.focusId).toBe('parent')
    expect(ids(host)).toEqual(['parent', 'plum', 'peach'])
    host.onSelectKey({ detail: { key: 'p' }, currentTarget: { dataset: { id: 'parent' } } })
    expect(host.data.focusId).toBe('plum')
    expect(host.data.selected).toBe('')
    expect(ids(host)).toEqual(['parent', 'plum', 'peach'])
    host.onSelectKey({ detail: { key: 'p' }, currentTarget: { dataset: { id: 'plum' } } })
    expect(host.data.focusId).toBe('peach')
    host.onSelectKey({ detail: { key: 'z' }, currentTarget: { dataset: { id: 'peach' } } })
    expect(host.data.focusId).toBe('peach')

    const disabled = await hostFor({ nodes: rows, disabled: true })
    disabled.onSelectKey({ detail: { key: 'p' }, currentTarget: { dataset: { id: 'parent' } } })
    expect(disabled.data.focusId).toBe('parent')
    expect(ids(disabled)).toEqual(['parent', 'plum', 'peach'])
  })

  it('indents a child row by the indent prop', async () => {
    const host = await hostFor({ nodes, expandedKeys: ['a'], indent: 32 })
    const row = (id: string) => host.data.flatNodes?.find((node) => node.id === id) as { pad?: number }
    expect(row('a').pad).toBe(0)
    expect(row('b').pad).toBe(32)

    const fallback = await hostFor({ nodes, expandedKeys: ['a'] })
    const child = fallback.data.flatNodes?.find((node) => node.id === 'b') as { pad?: number }
    expect(child.pad).toBe(20)
  })
})
