import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { expanded?: boolean }
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
  await import(pathToFileURL(path.join(__dirname, 'index.ts')).href)
  if (!captured) throw new Error('accordion item was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const taps: string[] = []
  const host = {
    properties: { ...defaults, ...properties },
    data,
    parent: {
      handleItemTap(value: string) {
        taps.push(value)
      },
    },
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, { taps }) as typeof host & {
    onTap: () => void
    onKey: (event?: { detail?: { key?: string } }) => void
    taps: string[]
  }
}

describe('weapp accordion item', () => {
  it('exposes an expandable button and its region', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'index.wxml'), 'utf8')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain("aria-expanded=\"{{expanded ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="region"')
    expect(markup).toContain('aria-labelledby="accordion-item-{{value}}-trigger"')
  })

  it('opens its own value and ignores a disabled item', async () => {
    const disabled = await hostFor({ value: 'pay', disabled: true })
    disabled.onKey({ detail: { key: ' ' } })
    expect(disabled.taps).toEqual([])

    const enabled = await hostFor({ value: 'ship' })
    enabled.onKey({ detail: { key: 'Enter' } })
    expect(enabled.taps).toEqual(['ship'])
  })
})
