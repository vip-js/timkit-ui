import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { value?: number }
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
  await import(pathToFileURL(path.join(__dirname, 'slider.ts')).href)
  if (!captured) throw new Error('slider component was not registered')
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
    events: [] as Array<{ name: string; detail: { detail?: { value?: number[] } } }>,
    triggerEvent(name: string, detail: { detail?: { value?: number[] } }) {
      host.events.push({ name, detail })
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return Object.assign(host, {
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }) as typeof host & {
    onSliderChange: (event?: { detail?: { value?: number } }) => void
    onSliderChanging: (event?: { detail?: { value?: number } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail: { detail?: { value?: number[] } } }>
  }
}

describe('weapp slider', () => {
  it('sends key events to the shared slider key', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'slider.wxml'), 'utf8')
    expect(markup.indexOf('bindkeydown="onKey"')).toBeGreaterThan(markup.indexOf('<slider'))
    expect(markup).toContain("aria-orientation=\"{{orientation === 'vertical' ? 'vertical' : 'horizontal'}}\"")
    expect(markup.split('<slider')[0]).not.toContain('aria-readonly')
    expect(markup.split('<slider')[1]).toContain("aria-readonly=\"{{readOnly ? 'true' : 'false'}}\"")
    expect(markup).toContain('disabled="{{disabled || readOnly}}"')
  })

  it('follows a later value while dragging stays disabled', async () => {
    const host = await hostFor({ value: 10 })
    expect(host.data.value).toBe(10)
    host.onSliderChanging({ detail: { value: 80 } })
    host.onSliderChange({ detail: { value: 90 } })
    expect(host.data.value).toBe(10)
    expect(host.events.at(-1)?.detail.detail?.value).toEqual([90])
    host.setProperty('value', 70)
    expect(host.data.value).toBe(70)
    host.setProperty('value', '')
    expect(host.data.value).toBe('')
    host.onSliderChange({ detail: { value: 90 } })
    expect(host.data.value).toBe('')
    expect(host.events.at(-1)?.detail.detail?.value).toEqual([90])
    host.setProperty('value', 40)
    expect(host.data.value).toBe(40)

    const disabled = await hostFor({ disabled: true, value: 10 })
    disabled.onSliderChange({ detail: { value: 90 } })
    expect(disabled.data.value).toBe(10)
    disabled.setProperty('value', 40)
    expect(disabled.data.value).toBe(40)
  })

  it('starts at the default value and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: 40 })
    expect(preset.data.value).toBe(40)
    preset.onSliderChange({ detail: { value: 64 } })
    expect(preset.data.value).toBe(64)

    const held = await hostFor({ value: '', defaultValue: 40 })
    expect(held.data.value).toBe('')
    held.onSliderChange({ detail: { value: 90 } })
    expect(held.data.value).toBe('')
    expect(held.events.at(-1)?.detail.detail?.value).toEqual([90])
  })

  it('steps with the shared ArrowRight key and ignores it while disabled', async () => {
    const host = await hostFor({ defaultValue: 20 })
    host.onKey({ detail: { key: 'ArrowRight' } })
    expect(host.data.value).toBe(21)
    const markup = fs.readFileSync(path.join(__dirname, 'slider.wxml'), 'utf8')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('wx:if="{{value !== \'\'}}"')

    const held = await hostFor({ value: 20 })
    held.onKey({ detail: { key: 'ArrowRight' } })
    expect(held.data.value).toBe(20)
    expect(held.events.at(-1)?.detail.detail?.value).toEqual([21])

    const disabled = await hostFor({ disabled: true, defaultValue: 20 })
    disabled.onKey({ detail: { key: 'ArrowRight' } })
    expect(disabled.data.value).toBe(20)
    expect(disabled.events).toEqual([])
  })

  it('selects a value when enabled and ignores dragging while disabled', async () => {
    const enabled = await hostFor()
    enabled.onSliderChanging({ detail: { value: 40 } })
    expect(enabled.data.value).toBe(40)
    enabled.onSliderChange({ detail: { value: 64 } })
    expect(enabled.data.value).toBe(64)

    const disabled = await hostFor({ disabled: true, value: 10 })
    disabled.onSliderChanging({ detail: { value: 80 } })
    disabled.onSliderChange({ detail: { value: 90 } })
    expect(disabled.data.value).toBe(10)
  })

  it('ignores dragging and keys while read-only and still follows a later value', async () => {
    const frozen = await hostFor({ readOnly: true, value: 10 })
    frozen.onSliderChanging({ detail: { value: 80 } })
    frozen.onSliderChange({ detail: { value: 90 } })
    frozen.onKey({ detail: { key: 'ArrowRight' } })
    expect(frozen.data.value).toBe(10)
    expect(frozen.events).toEqual([])
    frozen.setProperty('value', 40)
    expect(frozen.data.value).toBe(40)
  })

  it('moves with Up when orientation is vertical and ignores Right', async () => {
    const horizontal = await hostFor({ defaultValue: 20 })
    horizontal.onKey({ detail: { key: 'ArrowUp' } })
    expect(horizontal.data.value).toBe(20)
    horizontal.onKey({ detail: { key: 'ArrowRight' } })
    expect(horizontal.data.value).toBe(21)

    const vertical = await hostFor({ orientation: 'vertical', defaultValue: 20 })
    vertical.onKey({ detail: { key: 'ArrowRight' } })
    expect(vertical.data.value).toBe(20)
    vertical.onKey({ detail: { key: 'ArrowUp' } })
    expect(vertical.data.value).toBe(21)
  })

  it('jumps to the minimum with Home and the maximum with End', async () => {
    const host = await hostFor({ defaultValue: 20 })
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.value).toBe(0)
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.value).toBe(100)

    const vertical = await hostFor({ orientation: 'vertical', defaultValue: 20 })
    vertical.onKey({ detail: { key: 'Home' } })
    expect(vertical.data.value).toBe(0)
    vertical.onKey({ detail: { key: 'End' } })
    expect(vertical.data.value).toBe(100)

    const disabled = await hostFor({ disabled: true, defaultValue: 20 })
    disabled.onKey({ detail: { key: 'Home' } })
    expect(disabled.data.value).toBe(20)
    expect(disabled.events).toEqual([])

    const frozen = await hostFor({ readOnly: true, defaultValue: 20 })
    frozen.onKey({ detail: { key: 'End' } })
    expect(frozen.data.value).toBe(20)
    expect(frozen.events).toEqual([])
  })

  it('moves by ten steps with PageUp and PageDown', async () => {
    const host = await hostFor({ defaultValue: 20 })
    host.onKey({ detail: { key: 'PageUp' } })
    expect(host.data.value).toBe(30)
    host.onKey({ detail: { key: 'PageDown' } })
    expect(host.data.value).toBe(20)

    const vertical = await hostFor({ orientation: 'vertical', defaultValue: 20 })
    vertical.onKey({ detail: { key: 'PageUp' } })
    expect(vertical.data.value).toBe(30)

    const high = await hostFor({ defaultValue: 95 })
    high.onKey({ detail: { key: 'PageUp' } })
    expect(high.data.value).toBe(100)
    const low = await hostFor({ defaultValue: 5 })
    low.onKey({ detail: { key: 'PageDown' } })
    expect(low.data.value).toBe(0)

    const stepped = await hostFor({ defaultValue: 20, step: 2 })
    stepped.onKey({ detail: { key: 'PageUp' } })
    expect(stepped.data.value).toBe(40)

    const disabled = await hostFor({ disabled: true, defaultValue: 20 })
    disabled.onKey({ detail: { key: 'PageUp' } })
    expect(disabled.data.value).toBe(20)
    expect(disabled.events).toEqual([])

    const frozen = await hostFor({ readOnly: true, defaultValue: 20 })
    frozen.onKey({ detail: { key: 'PageDown' } })
    expect(frozen.data.value).toBe(20)
    expect(frozen.events).toEqual([])
  })

  it('moves by ten steps when Shift is held with an arrow', async () => {
    const host = await hostFor({ defaultValue: 20 })
    host.onKey({ detail: { key: 'ArrowRight', shiftKey: true } })
    expect(host.data.value).toBe(30)
    host.onKey({ detail: { key: 'ArrowUp', shiftKey: true } })
    expect(host.data.value).toBe(30)

    const vertical = await hostFor({ orientation: 'vertical', defaultValue: 20 })
    vertical.onKey({ detail: { key: 'ArrowUp', shiftKey: true } })
    expect(vertical.data.value).toBe(30)
    vertical.onKey({ detail: { key: 'ArrowRight', shiftKey: true } })
    expect(vertical.data.value).toBe(30)

    const high = await hostFor({ defaultValue: 95 })
    high.onKey({ detail: { key: 'ArrowRight', shiftKey: true } })
    expect(high.data.value).toBe(100)

    const disabled = await hostFor({ disabled: true, defaultValue: 20 })
    disabled.onKey({ detail: { key: 'ArrowRight', shiftKey: true } })
    expect(disabled.data.value).toBe(20)

    const frozen = await hostFor({ readOnly: true, defaultValue: 20 })
    frozen.onKey({ detail: { key: 'ArrowLeft', shiftKey: true } })
    expect(frozen.data.value).toBe(20)
  })

  it('keeps the value inside a later min and max', async () => {
    const high = await hostFor({ defaultValue: 80 })
    high.setProperty('max', 40)
    expect(high.data.value).toBe(40)
    expect(high.events.at(-1)?.detail.detail?.value).toEqual([40])

    const low = await hostFor({ defaultValue: 10 })
    low.setProperty('min', 30)
    expect(low.data.value).toBe(30)

    const held = await hostFor({ value: 80 })
    held.setProperty('max', 40)
    expect(held.data.value).toBe(80)
    expect(held.events.at(-1)?.detail.detail?.value).toEqual([40])
    held.setProperty('value', 40)
    expect(held.data.value).toBe(40)
  })

  it('uses a passed accessible name and names an omitted slider Value', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'slider.wxml'), 'utf8')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{ariaLabel && labelledBy && value !== \'\'}}"')
    expect(markup).toContain('wx:elif="{{ariaLabel && labelledBy}}"')
    expect(markup).toContain('aria-valuemin="{{min}}"')
    expect(markup).toContain('aria-valuemax="{{max}}"')
    expect(markup).toContain('aria-valuenow="{{value}}"')
    expect(markup.split('wx:else')[1].split('role="status"')[0]).not.toContain('aria-valuenow')
    expect(markup).toContain('wx:elif="{{labelledBy}}"')
    expect(markup).toContain('aria-label="Value"')
    expect(markup).not.toContain("aria-label=\"{{ariaLabel ? ariaLabel : (labelledBy ? '' : 'Value')}}\"")
    const named = await hostFor({ 'aria-label': 'Volume' })
    expect(named.data.ariaLabel).toBe('Volume')
    const plain = await hostFor()
    expect(plain.data.ariaLabel).toBe('')
    expect(plain.data.labelledBy).toBe('')
    plain.setProperty('aria-label', 'Brightness')
    expect(plain.data.ariaLabel).toBe('Brightness')
    const labelled = await hostFor({ 'aria-labelledby': 'volume-title' })
    expect(labelled.data.ariaLabel).toBe('')
    expect(labelled.data.labelledBy).toBe('volume-title')
    const both = await hostFor({ 'aria-label': 'Volume', 'aria-labelledby': 'volume-title' })
    expect(both.data.ariaLabel).toBe('Volume')
    expect(both.data.labelledBy).toBe('volume-title')
    labelled.setProperty('aria-labelledby', '')
    expect(labelled.data.labelledBy).toBe('')
  })
})
