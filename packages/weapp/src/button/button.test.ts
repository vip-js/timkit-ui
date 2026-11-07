import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { accessibleName?: string; loadStatus?: string }
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
  await import(pathToFileURL(path.join(__dirname, 'button.ts')).href)
  if (!captured) throw new Error('button component was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown>) => {
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
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host
}

describe('weapp button', () => {
  it('names an icon button from ariaLabel or label, and leaves text buttons unnamed', async () => {
    const named = await hostFor({ size: 'icon', ariaLabel: 'Close' })
    expect(named.data.accessibleName).toBe('Close')

    const labeled = await hostFor({ size: 'icon', label: 'Search' })
    expect(labeled.data.accessibleName).toBe('Search')

    const text = await hostFor({ size: 'default', label: 'Save' })
    expect(text.data.accessibleName).toBe('')
  })

  it('ignores a press while loading and marks the control busy', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'button.wxml'), 'utf8')
    expect(markup).toContain('disabled="{{disabled || loading}}"')
    expect(markup).toContain("aria-busy=\"{{loading ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="status"')
    expect(markup).toContain('class="button-loading-icon" aria-hidden="true"')

    const host = await hostFor({ loading: true, label: 'Save' })
    expect(host.data.loadStatus).toBe('Loading')
    const ready = await hostFor({ label: 'Go' })
    expect(ready.data.loadStatus).toBe('')
    const events: string[] = []
    const busy = Object.assign(host, {
      triggerEvent(name: string) {
        events.push(name)
      },
    }) as typeof host & { onTap: () => void }
    busy.onTap()
    expect(events).toEqual([])
  })
})