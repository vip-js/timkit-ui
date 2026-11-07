import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { current?: number | null; percent?: number; state?: string; ariaLabel?: string; labelledBy?: string }
  methods?: Record<string, () => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void; detached?: () => void }
}

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'index.ts')).href)
  if (!captured) throw new Error('progress was not registered')
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
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    detached: () => definition.lifetimes?.detached?.call(host),
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  })
}

describe('weapp progress', () => {
  it('omits the current value while indeterminate', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'index.wxml'), 'utf8')
    const indeterminate = markup.split('wx:elif')[0]
    expect(indeterminate).toContain('role="progressbar"')
    expect(indeterminate).not.toContain('aria-valuenow')
    expect(indeterminate).not.toContain('aria-valuetext')
    expect(markup).toContain('aria-valuenow="{{current}}"')
    expect(markup).toContain('aria-valuetext="{{valueText}}"')
    expect(markup).toContain('data-slot="progress-value"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{labelledBy && state === \'indeterminate\'}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Progress'}}\"")
    expect(markup).not.toContain("aria-label=\"{{labelledBy ? '' : (ariaLabel || 'Progress')}}\"")
  })

  it('shows the shared percent and an indeterminate state when the value is empty', async () => {
    const host = await hostFor({ value: 40, max: 100 })
    expect(host.data.current).toBe(40)
    expect(host.data.percent).toBe(40)
    expect(host.data.valueText).toBe('40%')
    expect(host.data.state).toBe('loading')
    host.detached()

    const empty = await hostFor({ value: null })
    expect(empty.data.state).toBe('indeterminate')
    expect(empty.data.percent).toBe(0)
    expect(empty.data.valueText).toBe('')
    empty.detached()

    const omitted = await hostFor()
    expect(omitted.data.state).toBe('indeterminate')
    expect(omitted.data.current).toBeNull()
    expect(omitted.data.ariaLabel).toBe('')
    omitted.detached()

    const named = await hostFor({ 'aria-label': 'Loading', 'aria-labelledby': 'progress-title' })
    expect(named.data.ariaLabel).toBe('Loading')
    expect(named.data.labelledBy).toBe('progress-title')
    named.setProperty('aria-labelledby', '')
    expect(named.data.labelledBy).toBe('')
    named.detached()

    const zero = await hostFor({ value: 0 })
    expect(zero.data.state).toBe('loading')
    expect(zero.data.current).toBe(0)
    expect(zero.data.percent).toBe(0)
    expect(zero.data.valueText).toBe('0%')
    zero.detached()

    const capped = await hostFor({ value: 150, max: 100 })
    expect(capped.data.percent).toBe(100)
    expect(capped.data.valueText).toBe('100%')
    const half = await hostFor({ value: 50, max: 200 })
    expect(half.data.valueText).toBe('25%')
    half.detached()
    capped.detached()
  })
})
