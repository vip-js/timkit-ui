import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { selected?: string[]; checkedMap?: Record<string, boolean>; checkStatus?: string }
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
  await import(pathToFileURL(path.join(__dirname, 'checkbox-tree.ts')).href)
  if (!captured) throw new Error('checkbox tree was not registered')
  definitionCache = captured
  return definitionCache
}

const nodes = [
  {
    id: 'root',
    label: 'Root',
    children: [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B', disabled: true },
    ],
  },
]

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const host = {
    properties: { ...defaults, nodes, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    events: [] as Array<{ name: string; detail?: { detail?: { checkedKeys?: string[] } } }>,
    triggerEvent(name: string, detail?: { detail?: { checkedKeys?: string[] } }) {
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
    onToggleKey: (event?: { detail?: { key?: string }; currentTarget?: { dataset?: { id?: string } } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { detail?: { checkedKeys?: string[] } } }>
  }
}

describe('weapp checkbox tree', () => {
  it('exposes a tree of checkboxes', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'checkbox-tree.wxml'), 'utf8')
    expect(markup).toContain('role="tree"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Checkbox tree'}}\"")
    expect(markup).not.toContain("aria-label=\"{{labelledBy ? '' : (ariaLabel || 'Checkbox tree')}}\"")
    expect(markup).toContain("tabindex=\"{{item.disabled ? -1 : 0}}\"")
    expect(markup).toContain('role="treeitem"')
    expect(markup).toContain('aria-label="{{item.label}}"')
    expect(markup).toContain("aria-checked=\"{{checkedMap[item.id] ? 'true' : 'false'}}\"")
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain('aria-level="{{item.level + 1}}"')
    expect(markup).toContain("aria-disabled=\"{{item.disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('bindkeydown="onToggleKey"')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    expect(plain.data.labelledBy).toBe('')
    const named = await hostFor({ 'aria-label': 'Files', 'aria-labelledby': 'files-title' })
    expect(named.data.ariaLabel).toBe('Files')
    expect(named.data.labelledBy).toBe('files-title')
    named.setProperty('aria-labelledby', '')
    expect(named.data.labelledBy).toBe('')
  })

  it('follows a later checked list and ignores a disabled node', async () => {
    const host = await hostFor({ checkedKeys: ['a'] })
    expect(host.data.checkedMap?.a).toBe(true)
    expect(host.data.checkStatus).toBe('1 checked')
    expect(host.data.checkedMap?.b).toBeUndefined()
    host.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    expect(host.data.checkedMap?.a).toBe(true)
    expect(host.events.at(-1)?.name).toBe('update:checkedKeys')
    expect(host.events.at(-1)?.detail).toEqual([])
    host.onToggle({ currentTarget: { dataset: { id: 'b' } } })
    expect(host.data.checkedMap?.b).toBeUndefined()
    host.setProperty('checkedKeys', ['b'])
    expect(host.data.checkedMap?.b).toBe(true)
    expect(host.data.checkedMap?.a).toBeUndefined()
    host.setProperty('checkedKeys', [])
    expect(host.data.checkedMap?.a).toBeUndefined()
    expect(host.data.checkStatus).toBe('')
    expect(host.data.checkedMap?.b).toBeUndefined()
  })

  it('checks enabled descendants and ignores a disabled node', async () => {
    const host = await hostFor()
    host.onToggleKey({ detail: { key: ' ' }, currentTarget: { dataset: { id: 'root' } } })
    expect([...(host.data.selected ?? [])].sort()).toEqual(['a', 'root'])
    expect(host.data.checkStatus).toBe('2 checked')
    expect(host.data.checkedMap?.b).toBeUndefined()
    host.onToggleKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { id: 'b' } } })
    expect(host.data.checkedMap?.b).toBeUndefined()
    host.onToggle({ currentTarget: { dataset: { id: 'root' } } })
    expect(host.data.selected).toEqual([])
    expect(host.data.checkStatus).toBe('')
  })

  it('stays empty when checked keys are empty even if a node starts checked', async () => {
    const host = await hostFor({
      nodes: [{ id: 'a', label: 'A', checked: true }],
      checkedKeys: [],
    })
    expect(host.data.checkedMap?.a).toBeUndefined()
    host.onToggle({ currentTarget: { dataset: { id: 'a' } } })
    expect(host.data.checkedMap?.a).toBeUndefined()
    expect(host.events.at(-1)?.detail).toEqual(['a'])
  })
})
