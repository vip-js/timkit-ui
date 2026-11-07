import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { expanded?: boolean }
  methods?: Record<string, (event?: { detail?: { key?: string } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'popover-trigger.ts')).href)
  if (!captured) throw new Error('popover trigger was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const parent = { taps: 0, data: { opened: false }, onTriggerTap() { this.taps += 1; this.data.opened = true } }
  const host = {
    properties: { ...defaults, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
    },
    getRelationNodes: () => [parent],
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, { parent }) as typeof host & {
    onKey: (event?: { detail?: { key?: string } }) => void
    parent: { taps: number }
  }
}

describe('weapp popover trigger', () => {
  it('is a dialog button', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'popover-trigger.wxml'), 'utf8')
    expect(markup).toContain('role="button"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain('aria-haspopup="dialog"')
    expect(markup).toContain('bindkeydown="onKey"')
  })

  it('opens from Enter and ignores a disabled trigger', async () => {
    const host = await hostFor()
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.parent.taps).toBe(1)
    expect(host.data.expanded).toBe(true)

    const disabled = await hostFor({ disabled: true })
    disabled.onKey({ detail: { key: ' ' } })
    expect(disabled.parent.taps).toBe(0)
  })
})
