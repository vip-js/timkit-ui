import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { current?: number; rows?: Array<{ state?: string }>; stepStatus?: string }
  methods?: Record<string, (event?: unknown) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'timeline.ts')).href)
  if (!captured) throw new Error('timeline was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const events: Array<{ name: string; detail: unknown }> = []
  const host = {
    properties: { ...defaults, ...properties },
    data,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    triggerEvent(name: string, detail: unknown) {
      events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    events,
    detached: () => definition.lifetimes?.detached?.call(host),
  }) as typeof host & {
    events: Array<{ name: string; detail: unknown }>
    onItemTap: (event: { currentTarget: { dataset: { index: number } } }) => void
    onItemKey: (event: { detail?: { key?: string }; currentTarget: { dataset: { index: number } } }) => void
    setProperty: (key: string, value: unknown) => void
    detached: () => void
  }
}

describe('weapp timeline', () => {
  it('marks the active step as the current step', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'timeline.wxml'), 'utf8')
    expect(markup).not.toContain('role="list"')
    expect(markup).toContain('class="timeline-dot" data-type="{{item.type || \'default\'}}" aria-hidden="true"')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('aria-level="3"')
    expect(markup).toContain("tabindex=\"{{item.disabled || disabled ? -1 : 0}}\"")
    expect(markup).toContain('bindkeydown="onItemKey"')
    expect(markup).toContain('aria-current="step"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain("aria-disabled=\"{{item.disabled || disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Timeline'}}\"")
    expect(markup).not.toContain("aria-label=\"{{labelledBy ? '' : (ariaLabel || 'Timeline')}}\"")
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    expect(plain.data.labelledBy).toBe('')
    const named = await hostFor({ 'aria-label': 'History', 'aria-labelledby': 'history-title' })
    expect(named.data.ariaLabel).toBe('History')
    expect(named.data.labelledBy).toBe('history-title')
    named.setProperty('aria-labelledby', '')
    expect(named.data.labelledBy).toBe('')
  })

  it('selects a step and ignores a disabled step', async () => {
    const host = await hostFor({
      items: [{ title: 'One' }, { title: 'Two' }, { title: 'Three', disabled: true }],
    })
    expect(host.data.current).toBe(1)
    expect(host.data.rows?.[0]?.state).toBe('active')
    expect(host.data.stepStatus).toBe('Step 1 of 3')
    host.onItemTap({ currentTarget: { dataset: { index: 1 } } })
    expect(host.data.current).toBe(2)
    expect(host.data.stepStatus).toBe('Step 2 of 3')
    expect(host.data.rows?.[1]?.state).toBe('active')
    expect(host.data.rows?.[0]?.state).toBe('completed')
    expect(host.events).toEqual([{ name: 'change', detail: { value: 2 } }])
    host.onItemTap({ currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe(2)
    host.onItemKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { index: 0 } } })
    expect(host.data.current).toBe(1)
    expect(host.events).toEqual([
      { name: 'change', detail: { value: 2 } },
      { name: 'change', detail: { value: 1 } },
    ])

    const locked = await hostFor({
      items: [{ title: 'One' }, { title: 'Two' }],
      disabled: true,
    })
    locked.onItemTap({ currentTarget: { dataset: { index: 1 } } })
    expect(locked.data.current).toBe(1)
    host.detached()
    locked.detached()
  })

  it('keeps a controlled step until the parent changes it', async () => {
    const host = await hostFor({
      value: 1,
      items: [{ title: 'One' }, { title: 'Two' }],
    })
    host.onItemTap({ currentTarget: { dataset: { index: 1 } } })
    expect(host.data.current).toBe(1)
    expect(host.data.rows?.[0]?.state).toBe('active')
    expect(host.events).toEqual([{ name: 'change', detail: { value: 2 } }])
    host.setProperty('value', 2)
    expect(host.data.current).toBe(2)
    expect(host.data.rows?.[1]?.state).toBe('active')
    host.setProperty('value', '')
    expect(host.data.current).toBeNull()
    expect(host.data.rows?.every((row) => row.state === 'inactive')).toBe(true)
    host.onItemTap({ currentTarget: { dataset: { index: 0 } } })
    expect(host.data.current).toBeNull()
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: 1 } })
    host.detached()
  })

  it('is vertical unless orientation is horizontal', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'timeline.wxml'), 'utf8')
    expect(markup).toContain(
      "data-orientation=\"{{orientation === 'horizontal' ? 'horizontal' : 'vertical'}}\""
    )
    const host = await hostFor()
    expect(host.properties.orientation).toBe('vertical')
    const horizontal = await hostFor({ orientation: 'horizontal' })
    expect(horizontal.properties.orientation).toBe('horizontal')
    host.detached()
    horizontal.detached()
  })

  it('selects the next enabled step with the axis arrows and Home or End', async () => {
    const items = [{ title: 'One' }, { title: 'Two', disabled: true }, { title: 'Three' }]
    const host = await hostFor({ items, defaultValue: 1 })
    host.onItemKey({ detail: { key: 'ArrowDown' }, currentTarget: { dataset: { index: 0 } } })
    expect(host.data.current).toBe(3)
    host.onItemKey({ detail: { key: 'ArrowDown' }, currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe(3)
    host.onItemKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe(3)
    host.onItemKey({ detail: { key: 'Home' }, currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe(1)
    host.onItemKey({ detail: { key: 'End' }, currentTarget: { dataset: { index: 0 } } })
    expect(host.data.current).toBe(3)

    const horizontal = await hostFor({
      orientation: 'horizontal',
      defaultValue: 1,
      items: [{ title: 'One' }, { title: 'Two' }],
    })
    horizontal.onItemKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { index: 0 } } })
    expect(horizontal.data.current).toBe(2)
    horizontal.onItemKey({ detail: { key: 'ArrowDown' }, currentTarget: { dataset: { index: 1 } } })
    expect(horizontal.data.current).toBe(2)

    const disabled = await hostFor({ disabled: true, defaultValue: 1, items: [{ title: 'One' }, { title: 'Two' }] })
    disabled.onItemKey({ detail: { key: 'ArrowDown' }, currentTarget: { dataset: { index: 0 } } })
    expect(disabled.data.current).toBe(1)
    host.detached()
    horizontal.detached()
    disabled.detached()
  })
})
