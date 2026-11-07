import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { axisX?: boolean; axisY?: boolean; axisStatus?: string }
  methods?: Record<string, () => void>
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
  await import(pathToFileURL(path.join(__dirname, 'scroll-area.ts')).href)
  if (!captured) throw new Error('scroll area was not registered')
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
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host
}

describe('weapp scroll area', () => {
  it('follows a later orientation', async () => {
    const host = await hostFor()
    expect(host.data.axisY).toBe(true)
    expect(host.data.axisX).toBe(false)
    expect(host.data.axisStatus).toBe('Vertical')
    host.setProperty('orientation', 'horizontal')
    expect(host.data.axisX).toBe(true)
    expect(host.data.axisY).toBe(false)
    expect(host.data.axisStatus).toBe('Horizontal')
    host.setProperty('orientation', 'both')
    expect(host.data.axisX).toBe(true)
    expect(host.data.axisY).toBe(true)
    expect(host.data.axisStatus).toBe('Both')
  })

  it('scrolls on the requested axis', async () => {
    const vertical = await hostFor()
    expect(vertical.data.axisY).toBe(true)
    expect(vertical.data.axisX).toBe(false)
    const horizontal = await hostFor({ orientation: 'horizontal' })
    expect(horizontal.data.axisX).toBe(true)
    expect(horizontal.data.axisY).toBe(false)
    const both = await hostFor({ orientation: 'both' })
    expect(both.data.axisX).toBe(true)
    expect(both.data.axisY).toBe(true)

    const extraY = await hostFor({ orientation: 'horizontal', scrollY: true })
    expect(extraY.data.axisX).toBe(true)
    expect(extraY.data.axisY).toBe(true)
    extraY.setProperty('scrollY', false)
    expect(extraY.data.axisX).toBe(true)
    expect(extraY.data.axisY).toBe(false)

    const extraX = await hostFor({ orientation: 'vertical', scrollX: true })
    expect(extraX.data.axisX).toBe(true)
    expect(extraX.data.axisY).toBe(true)
    extraX.setProperty('scrollX', false)
    expect(extraX.data.axisX).toBe(false)
    expect(extraX.data.axisY).toBe(true)
  })

  it('names an omitted scroller Scroll area and lets aria-labelledby suppress that name', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'scroll-area.wxml'), 'utf8')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Scroll area'}}\"")
    expect(markup).not.toContain("aria-label=\"{{labelledBy ? '' : (ariaLabel || 'Scroll area')}}\"")
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    expect(plain.data.labelledBy).toBe('')
    const named = await hostFor({ 'aria-label': 'Notes', 'aria-labelledby': 'notes-title' })
    expect(named.data.ariaLabel).toBe('Notes')
    expect(named.data.labelledBy).toBe('notes-title')
    named.setProperty('aria-labelledby', '')
    expect(named.data.labelledBy).toBe('')
  })
})
