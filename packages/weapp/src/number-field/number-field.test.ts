import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { current?: string; valueStatus?: string }
  methods?: Record<string, (event?: { detail?: { value?: string } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'number-field.ts')).href)
  if (!captured) throw new Error('number field was not registered')
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
    events: [] as Array<{ name: string; detail: unknown }>,
    triggerEvent(name: string, detail: unknown) {
      host.events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & {
    onIncrementTap: () => void
    onDecrementTap: () => void
    onIncrementKey: (event?: { detail?: { key?: string } }) => void
    onInputKey: (event?: { detail?: { key?: string } }) => void
    events: Array<{ name: string; detail: unknown }>
    onInput: (event?: { detail?: { value?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    detached: () => void
  } & { detached: () => void }
}

describe('weapp number field', () => {
  it('links an invalid number field to its error', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'number-field.wxml'), 'utf8')
    expect(markup).toContain("aria-invalid=\"{{invalid === true || invalid === 'true' ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="spinbutton"')
    expect(markup).toContain('aria-roledescription="numberfield"')
    expect(markup).toContain('aria-valuemin="{{min}}"')
    expect(markup).toContain('aria-valuemax="{{max}}"')
    expect(markup).toContain('wx:if="{{ariaLabel && labelledBy && describedBy && current !== \'\'}}"')
    expect(markup).toContain('aria-valuenow="{{current}}"')
    expect(markup.split('wx:else')[1].split('number-field-increment')[0]).not.toContain('aria-valuenow')
    expect(markup).toContain('wx:elif="{{ariaLabel && labelledBy && describedBy}}"')
    expect(markup).toContain('aria-describedby="{{describedBy}}"')
    expect(markup).not.toContain("aria-describedby=\"{{describedBy || ''}}\"")
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:elif="{{ariaLabel && labelledBy}}"')
    expect(markup).toContain('wx:elif="{{labelledBy}}"')
    expect(markup).toContain('aria-label="Number"')
    expect(markup).not.toContain("aria-label=\"{{ariaLabel ? ariaLabel : (labelledBy ? '' : 'Number')}}\"")
    expect(markup).toContain('role="group"')
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-invalid=\"{{invalid === true || invalid === 'true' ? 'true' : 'false'}}\"")
    expect(markup).toContain('aria-label="Decrease value"')
    expect(markup).toContain('<text aria-hidden="true">−</text>')
    expect(markup).toContain('<text aria-hidden="true">+</text>')
    expect(markup).toContain("tabindex=\"{{api.isAtMin || disabled || readOnly ? -1 : 0}}\"")
    expect(markup).toContain('aria-label="Increase value"')
    expect(markup).toContain('bindkeydown="onIncrementKey"')
    expect(markup).toContain('bindkeydown="onDecrementKey"')
    expect(markup).toContain('bindkeydown="onInputKey"')
  })

  it('follows a later value and ignores a disabled step', async () => {
    const host = await hostFor({ value: '1', disabled: true })
    expect(host.data.ariaLabel).toBe('')
    expect(host.data.labelledBy).toBe('')
    host.setProperty('aria-label', 'Count')
    expect(host.data.ariaLabel).toBe('Count')
    host.setProperty('aria-labelledby', 'count-title')
    expect(host.data.ariaLabel).toBe('Count')
    expect(host.data.labelledBy).toBe('count-title')
    const labelled = await hostFor({ 'aria-labelledby': 'count-title' })
    expect(labelled.data.ariaLabel).toBe('')
    expect(labelled.data.labelledBy).toBe('count-title')
    labelled.detached?.()
    expect(host.data.current).toBe('1')
    host.onIncrementTap()
    host.onInput({ detail: { value: '9' } })
    expect(host.data.current).toBe('1')
    host.setProperty('value', '4')
    expect(host.data.current).toBe('4')
    host.setProperty('value', '0')
    expect(host.data.current).toBe('0')
    host.detached?.()
  })

  it('asks the parent before changing a controlled value', async () => {
    const host = await hostFor({ value: '1' })
    host.onIncrementTap()
    expect(host.data.current).toBe('1')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: '2' } })
    host.onInput({ detail: { value: '9' } })
    expect(host.data.current).toBe('1')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: '9' } })
    host.setProperty('value', '9')
    expect(host.data.current).toBe('9')
    host.detached?.()
  })

  it('starts at the default value and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: '4' })
    expect(preset.data.current).toBe('4')
    expect(preset.data.valueStatus).toBe('4')
    preset.onIncrementTap()
    expect(preset.data.current).toBe('5')
    preset.detached?.()

    const held = await hostFor({ value: '', defaultValue: '4' })
    expect(held.data.current).toBe('')
    expect(held.data.valueStatus).toBe('')
    held.onIncrementTap()
    expect(held.data.current).toBe('')
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: '1' } })
    held.detached?.()
  })

  it('stays empty when the parent clears the value', async () => {
    const host = await hostFor({ value: '4' })
    host.setProperty('value', '')
    expect(host.data.current).toBe('')
    host.onIncrementTap()
    expect(host.data.current).toBe('')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: '1' } })
    host.detached?.()
  })

  it('steps the value and ignores a disabled or read-only field', async () => {
    const host = await hostFor()
    expect(host.data.current).toBe('0')
    host.onIncrementKey({ detail: { key: 'Enter' } })
    expect(host.data.current).toBe('1')
    host.onInputKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.current).toBe('0')
    host.onInputKey({ detail: { key: 'ArrowUp' } })
    expect(host.data.current).toBe('1')
    host.onInputKey({ detail: { key: 'PageUp' } })
    expect(host.data.current).toBe('11')
    host.onInputKey({ detail: { key: 'PageDown' } })
    expect(host.data.current).toBe('1')
    host.onInputKey({ detail: { key: 'ArrowUp', shiftKey: true } })
    expect(host.data.current).toBe('11')
    const high = await hostFor({ max: 100 })
    high.setData({ current: '95' })
    high.onInputKey({ detail: { key: 'PageUp' } })
    expect(high.data.current).toBe('100')
    const bounded = await hostFor({ min: 0, max: 100 })
    bounded.setData({ current: '20' })
    bounded.onInputKey({ detail: { key: 'Home' } })
    expect(bounded.data.current).toBe('0')
    bounded.onInputKey({ detail: { key: 'End' } })
    expect(bounded.data.current).toBe('100')
    const open = await hostFor()
    open.setData({ current: '20' })
    open.onInputKey({ detail: { key: 'Home' } })
    expect(open.data.current).toBe('-9007199254740991')
    open.onInputKey({ detail: { key: 'End' } })
    expect(open.data.current).toBe('9007199254740991')
    host.detached?.()

    const disabled = await hostFor({ value: '1', disabled: true })
    disabled.onIncrementKey({ detail: { key: ' ' } })
    disabled.onInputKey({ detail: { key: 'ArrowUp' } })
    disabled.onInputKey({ detail: { key: 'PageUp' } })
    disabled.onInput({ detail: { value: '9' } })
    expect(disabled.data.current).toBe('1')
    disabled.detached?.()

    const readOnly = await hostFor({ value: '1', readOnly: true })
    readOnly.onIncrementTap()
    readOnly.onInput({ detail: { value: '9' } })
    expect(readOnly.data.current).toBe('1')
    expect(readOnly.properties.disabled).toBe(false)
    expect(readOnly.properties.readOnly).toBe(true)
    const markup = fs.readFileSync(path.join(__dirname, 'number-field.wxml'), 'utf8')
    expect(markup).toContain('disabled="{{disabled}}"')
    expect(markup).toContain("aria-readonly=\"{{readOnly ? 'true' : 'false'}}\"")
    readOnly.detached?.()
  })

  it('keeps the value inside a later min and max', async () => {
    const high = await hostFor({ defaultValue: '80' })
    high.setProperty('max', 40)
    expect(high.data.current).toBe('40')
    expect(high.events.at(-1)).toEqual({ name: 'change', detail: { value: '40' } })
    high.detached?.()

    const low = await hostFor({ defaultValue: '10' })
    low.setProperty('min', 30)
    expect(low.data.current).toBe('30')
    low.detached?.()

    const held = await hostFor({ value: '80' })
    held.setProperty('max', 40)
    expect(held.data.current).toBe('80')
    expect(held.events.at(-1)).toEqual({ name: 'change', detail: { value: '40' } })
    held.detached?.()
  })
})
