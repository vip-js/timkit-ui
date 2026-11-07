import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { variantName?: string; className?: string; toneStatus?: string }
  methods?: Record<string, () => void>
  properties?: Record<string, { value?: unknown }>
  lifetimes?: { attached?: () => void }
}

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'badge.ts')).href)
  if (!captured) throw new Error('badge was not registered')
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
    },
    triggerEvent() {},
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host
}

describe('weapp badge', () => {
  it('marks the default and destructive badges', async () => {
    const fresh = await hostFor()
    expect(fresh.data.variantName).toBe('default')
    expect(fresh.data.toneStatus).toBe('')
    expect(fresh.data.className).toContain('bg-primary')
    const failed = await hostFor({ variant: 'destructive' })
    expect(failed.data.variantName).toBe('destructive')
    expect(failed.data.toneStatus).toBe('Destructive')
    expect(failed.data.className).toContain('bg-destructive')
  })
})
