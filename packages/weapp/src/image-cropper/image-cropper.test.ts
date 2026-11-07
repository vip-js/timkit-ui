import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { cropX?: number; cropY?: number; cropWidth?: number; cropHeight?: number; ratioStatus?: string }
  methods?: Record<string, (event?: { detail?: { value?: number } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'image-cropper.ts')).href)
  if (!captured) throw new Error('image cropper was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const events: string[] = []
  const details: Array<{ x?: number; y?: number; width?: number; height?: number } | undefined> = []
  const host = {
    properties: { ...defaults, ...properties },
    data,
    events,
    details,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
      for (const key of Object.keys(update)) definition.observers?.[key]?.call(host, update[key])
    },
    triggerEvent(name: string, detail?: { x?: number; y?: number; width?: number; height?: number }) {
      events.push(name)
      details.push(detail)
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onXChange: (event?: { detail?: { value?: number } }) => void
    onApplyCrop: () => void
    setProperty: (key: string, value: unknown) => void
    details: Array<{ x?: number; y?: number; width?: number; height?: number } | undefined>
  }
}

describe('weapp image cropper', () => {
  it('names the crop sliders', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'image-cropper.wxml'), 'utf8')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Interactive image cropper'}}\"")
    expect(markup).toContain('role="group"')
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('alt="Crop preview"')
    expect(markup).toContain('aria-label="Crop preview"')
    expect(markup).toContain('aria-valuemin="0"')
    expect(markup).toContain('aria-valuemax="100"')
    expect(markup).toContain('aria-valuenow="{{cropX}}"')
    expect(markup).toContain('aria-valuenow="{{cropWidth}}"')
    expect(markup).toContain('aria-label="Crop X"')
    expect(markup).toContain('aria-label="Crop Y"')
    expect(markup).toContain('aria-label="Crop width"')
    expect(markup).toContain('aria-label="Crop height"')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    const named = await hostFor({ 'aria-label': 'Photo crop' })
    expect(named.data.ariaLabel).toBe('Photo crop')
    named.setProperty('aria-label', '')
    expect(named.data.ariaLabel).toBe('')
  })

  it('follows a later crop and ignores a slider while disabled', async () => {
    const host = await hostFor({ disabled: true, x: 10, y: 10 })
    host.onXChange({ detail: { value: 70 } })
    expect(host.data.cropX).toBe(10)
    host.setProperty('x', 48)
    expect(host.data.cropX).toBe(48)
    host.setProperty('width', 120)
    expect(host.data.cropWidth).toBe(120)
  })

  it('keeps the last crop when a side is cleared and does not write on drag', async () => {
    const host = await hostFor({ x: 40, y: 20, width: 60, height: 50 })
    expect(host.data.cropX).toBe(40)
    host.setProperty('x', 0)
    expect(host.data.cropX).toBe(0)
    host.setProperty('x', '')
    expect(host.data.cropX).toBe(0)
    expect(host.data.cropY).toBe(20)
    host.onXChange({ detail: { value: 70 } })
    expect(host.data.cropX).toBe(0)
    expect(host.details.at(-1)).toEqual({ x: 70 })
    host.setProperty('width', '')
    expect(host.data.cropWidth).toBe(60)
  })

  it('moves the crop rect and ignores the sliders while disabled', async () => {
    const held = await hostFor({ x: 10, y: 10, width: 80, height: 80 })
    held.onXChange({ detail: { value: 70 } })
    expect(held.data.cropX).toBe(10)
    expect(held.details.at(-1)).toEqual({ x: 70 })
    held.setProperty('x', 70)
    expect(held.data.cropX).toBe(70)
    held.onYChange({ detail: { value: 30 } })
    expect(held.data.cropY).toBe(10)
    held.setProperty('y', 30)
    expect(held.data.cropY).toBe(30)

    const enabled = await hostFor()
    enabled.onXChange({ detail: { value: 40 } })
    expect(enabled.data.cropX).toBe(40)
    enabled.onApplyCrop()
    expect(enabled.events).toContain('crop')

    const disabled = await hostFor({ disabled: true })
    disabled.onXChange({ detail: { value: 70 } })
    expect(disabled.data.cropX).toBe(10)
    disabled.onApplyCrop()
    expect(disabled.events).toEqual([])
  })

  it('keeps the crop on the aspect ratio and ignores a disabled change', async () => {
    const host = await hostFor({ aspect: 2 })
    expect(host.data.ratioStatus).toBe('2 to 1')
    expect(host.data.cropWidth).toBe(80)
    expect(host.data.cropHeight).toBe(40)
    host.onWidthChange({ detail: { value: 60 } })
    expect(host.data.cropWidth).toBe(60)
    expect(host.data.cropHeight).toBe(30)
    host.onHeightChange({ detail: { value: 20 } })
    expect(host.data.cropWidth).toBe(40)
    expect(host.data.cropHeight).toBe(20)

    const held = await hostFor({ aspect: 2, width: 80, height: 80 })
    held.onWidthChange({ detail: { value: 60 } })
    expect(held.data.cropWidth).toBe(80)
    expect(held.data.cropHeight).toBe(80)
    expect(held.details.at(-1)).toEqual({ width: 60, height: 30 })

    const open = await hostFor({})
    expect(open.data.ratioStatus).toBe('')
    const disabled = await hostFor({ aspect: 2, disabled: true })
    disabled.onWidthChange({ detail: { value: 60 } })
    expect(disabled.data.cropWidth).toBe(80)
    expect(disabled.data.cropHeight).toBe(40)
    expect(disabled.events).toEqual([])
  })
})
