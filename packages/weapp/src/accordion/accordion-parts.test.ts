import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ItemNode = {
  properties?: { value?: string }
  setData: (data: { expanded: boolean }) => void
}

type ComponentDefinition = {
  data?: { value?: string[] }
  methods?: Record<string, (target?: ItemNode) => void>
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
  if (!captured) throw new Error('accordion parts were not registered')
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
    triggerEvent() {},
    getRelationNodes() {
      return []
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    updateItem: (target: ItemNode) => void
  }
}

describe('weapp accordion parts', () => {
  it('expands the item whose property matches the open value', async () => {
    const host = await hostFor({ value: ['ship'] })
    host.data.value = ['ship']
    const seen: boolean[] = []
    host.updateItem({
      properties: { value: 'ship' },
      setData(update) {
        seen.push(update.expanded)
      },
    })
    host.updateItem({
      properties: { value: 'pay' },
      setData(update) {
        seen.push(update.expanded)
      },
    })
    expect(seen).toEqual([true, false])
  })

  it('opens the default item and stays shut when the value is empty', async () => {
    const host = await hostFor({ defaultValue: ['ship'] })
    const seen: boolean[] = []
    host.updateItem({
      properties: { value: 'ship' },
      setData(update) {
        seen.push(update.expanded)
      },
    })
    host.updateItem({
      properties: { value: 'pay' },
      setData(update) {
        seen.push(update.expanded)
      },
    })
    expect(host.data.value).toEqual(['ship'])
    expect(seen).toEqual([true, false])

    const held = await hostFor({ value: [], defaultValue: ['ship'] })
    expect(held.data.value).toEqual([])
    const closed: boolean[] = []
    held.updateItem({
      properties: { value: 'ship' },
      setData(update) {
        closed.push(update.expanded)
      },
    })
    expect(closed).toEqual([false])
  })
})
