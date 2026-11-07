import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { ariaLabel?: string; labelledBy?: string }
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value: unknown) => void>
  lifetimes?: { attached?: () => void }
}

describe('weapp navbar nav', () => {
  it('names the navigation landmark', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'navbar-nav.wxml'), 'utf8')
    expect(markup).toContain('role="navigation"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Navigation'}}\"")
    expect(markup).not.toContain("aria-label=\"{{labelledBy ? '' : (ariaLabel || 'Navigation')}}\"")

    let captured: ComponentDefinition | null = null
    ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
      captured = definition
    }
    await import(pathToFileURL(path.join(__dirname, 'navbar-nav.ts')).href)
    if (!captured) throw new Error('navbar nav was not registered')
    const definition: ComponentDefinition = captured
    const data = { ...(definition.data ?? {}) }
    const defaults: Record<string, unknown> = {}
    for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
    const host = {
      properties: { ...defaults, 'aria-label': 'Sections', 'aria-labelledby': 'nav-title' },
      data,
      setData(update: Record<string, unknown>) {
        Object.assign(data, update)
        for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
      },
      setProperty(key: string, value: unknown) {
        host.properties[key] = value
        definition.observers?.[key]?.call(host, value)
      },
    }
    definition.lifetimes?.attached?.call(host)
    expect(host.data.ariaLabel).toBe('Sections')
    expect(host.data.labelledBy).toBe('nav-title')
    host.setProperty('aria-labelledby', '')
    expect(host.data.labelledBy).toBe('')
    host.setProperty('aria-label', '')
    expect(host.data.ariaLabel).toBe('')
  })
})
