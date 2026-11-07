import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { current?: string }
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
  await import(pathToFileURL(path.join(__dirname, 'number-input.ts')).href)
  if (!captured) throw new Error('number input was not registered')
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
    events: Array<{ name: string; detail: unknown }>
    onIncrementTap: () => void
    onIncrementKey: (event?: { detail?: { key?: string } }) => void
    onInputKey: (event?: { detail?: { key?: string } }) => void
    onInput: (event?: { detail?: { value?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    detached: () => void
  }
}

describe('weapp number input', () => {
  it('names the step buttons', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'number-input.wxml'), 'utf8')
    expect(markup).toContain('role="group"')
    expect(markup).toContain("aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="button"')
    expect(markup).toContain('aria-label="Decrease value"')
    expect(markup).toContain("tabindex=\"{{api.isAtMin || disabled || readOnly ? -1 : 0}}\"")
    expect(markup).toContain('aria-label="Increase value"')
    expect(markup).toContain('bindkeydown="onIncrementKey"')
    expect(markup).toContain('bindkeydown="onDecrementKey"')
    expect(markup).toContain('bindkeydown="onInputKey"')
    expect(markup).toContain('aria-label="Number"')
    expect(markup).toContain('wx:if="{{current !== \'\'}}"')
    expect(markup).toContain('role="spinbutton"')
    expect(markup).toContain('aria-roledescription="numberfield"')
    expect(markup).toContain('aria-valuemin="{{min}}"')
    expect(markup).toContain('aria-valuemax="{{max}}"')
    expect(markup.split('wx:else')[1].split('Increase value')[0]).not.toContain('aria-valuenow')
    expect(markup).toContain('aria-readonly="{{readOnly ? \'true\' : \'false\'}}"')
    expect(markup).toContain('<text aria-hidden="true">−</text>')
    expect(markup).toContain('<text aria-hidden="true">+</text>')
    expect(markup).toContain('role="status"')
    expect(markup).toContain("aria-disabled=\"{{api.isAtMax || disabled || readOnly ? 'true' : 'false'}}\"")
  })

  it('follows a later value and ignores a disabled change', async () => {
    const host = await hostFor({ value: '1', disabled: true })
    expect(host.data.current).toBe('1')
    host.onIncrementTap()
    host.onInput({ detail: { value: '9' } })
    expect(host.data.current).toBe('1')
    host.setProperty('value', '4')
    expect(host.data.current).toBe('4')
    host.setProperty('value', '0')
    expect(host.data.current).toBe('0')
    expect(host.data.valueStatus).toBe('0')
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
    preset.onIncrementKey({ detail: { key: 'Enter' } })
    expect(preset.data.current).toBe('5')
    preset.onInputKey({ detail: { key: 'ArrowDown' } })
    expect(preset.data.current).toBe('4')
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
    expect(host.data.valueStatus).toBe('')
    host.onIncrementTap()
    expect(host.data.current).toBe('')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: '1' } })
    host.detached?.()
  })

  it('keeps the value inside a later min and max', async () => {
    const high = await hostFor({ defaultValue: '80' })
    high.setProperty('max', 40)
    expect(high.data.current).toBe('40')
    high.detached?.()

    const low = await hostFor({ defaultValue: '10' })
    low.setProperty('min', 30)
    expect(low.data.current).toBe('30')
    low.detached?.()
  })
})
