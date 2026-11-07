import fs from 'node:fs'
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
  await import(pathToFileURL(path.join(__dirname, 'alert.ts')).href)
  if (!captured) throw new Error('alert was not registered')
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

describe('weapp alert', () => {
  it('announces a default alert and a destructive alert', async () => {
    const saved = await hostFor()
    expect(saved.data.variantName).toBe('default')
    expect(saved.data.toneStatus).toBe('')
    expect(saved.data.className).toContain('bg-background')
    const failed = await hostFor({ variant: 'destructive' })
    expect(failed.data.variantName).toBe('destructive')
    expect(failed.data.toneStatus).toBe('Destructive')
    expect(failed.data.className).toContain('text-destructive')
  })

  it('keeps the title and description inside the alert', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'alert.wxml'), 'utf8')
    expect(markup).toContain('data-slot="alert-title"')
    expect(markup).toContain('role="heading"')
    expect(markup).toContain('aria-level="5"')
    expect(markup).toContain('data-slot="alert-description"')
    expect(markup.indexOf('data-slot="alert-title"')).toBeGreaterThan(markup.indexOf('role="alert"'))
    const host = await hostFor({ title: 'Saved', description: 'The file was stored.' })
    expect(host.properties.title).toBe('Saved')
    expect(host.properties.description).toBe('The file was stored.')
  })
})
