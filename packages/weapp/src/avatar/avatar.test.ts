import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { status?: string; imageStatus?: string }
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
  await import(pathToFileURL(path.join(__dirname, 'avatar.ts')).href)
  if (!captured) throw new Error('avatar was not registered')
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
  }) as typeof host & {
    onImageLoad: () => void
    onImageError: () => void
    detached: () => void
  }
}

describe('weapp avatar', () => {
  it('names the image with alt and shows the fallback when the image fails', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'avatar.wxml'), 'utf8')
    const image = fs.readFileSync(path.join(__dirname, '../avatar-image/index.wxml'), 'utf8')
    expect(image).toContain("alt=\"{{alt || 'Avatar'}}\"")
    expect(image).toContain("aria-label=\"{{alt || 'Avatar'}}\"")
    expect(markup).toContain("alt=\"{{alt || 'Avatar'}}\"")
    expect(markup).toContain("aria-label=\"{{alt || 'Avatar'}}\"")
    expect(markup).toContain("aria-label=\"{{alt || fallback || 'Avatar'}}\"")
    const host = await hostFor({ src: 'https://example.com/ada.png', alt: 'Ada', fallback: 'A' })
    expect(host.properties.alt).toBe('Ada')
    expect(host.data.status).toBe('loading')
    expect(host.data.imageStatus).toBe('')
    host.onImageError()
    expect(host.data.status).toBe('error')
    expect(host.data.imageStatus).toBe('Unavailable')
    host.onImageLoad()
    expect(host.data.status).toBe('loaded')
    expect(host.data.imageStatus).toBe('')
    host.detached()

    const empty = await hostFor({ fallback: 'A' })
    expect(empty.data.status).toBe('error')
    expect(empty.data.imageStatus).toBe('Unavailable')
    empty.detached()
  })
})
