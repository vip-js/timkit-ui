import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type Row = { state?: string }
type ComponentDefinition = {
  data?: { current?: string; rows?: Row[]; stepStatus?: string }
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
  await import(pathToFileURL(path.join(__dirname, 'stepper.ts')).href)
  if (!captured) throw new Error('stepper was not registered')
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
    onStepTap: (event: { currentTarget: { dataset: { index: number } } }) => void
    onStepKey: (event: { detail?: { key?: string }; currentTarget: { dataset: { index: number } } }) => void
    onIncrementKey: (event?: { detail?: { key?: string } }) => void
    onInput: (event: { detail: { value: string } }) => void
    onIncrementTap: () => void
    setProperty: (key: string, value: unknown) => void
    detached: () => void
  }
}

describe('weapp stepper', () => {
  it('names the step buttons', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'stepper.wxml'), 'utf8')
    expect(markup).toContain('aria-label="Decrease value"')
    expect(markup).toContain("tabindex=\"{{api.isAtMin || disabled || readOnly ? -1 : 0}}\"")
    expect(markup).toContain("tabindex=\"{{api.isAtMax || disabled || readOnly ? -1 : 0}}\"")
    expect(markup).toContain('aria-label="Increase value"')
    expect(markup).toContain('role="group" aria-readonly="{{readOnly ? \'true\' : \'false\'}}"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain('wx:if="{{labelledBy}}"')
    expect(markup).toContain('aria-labelledby="{{labelledBy}}"')
    expect(markup).toContain("aria-label=\"{{ariaLabel || 'Stepper'}}\"")
    expect(markup).not.toContain("aria-label=\"{{labelledBy ? '' : (ariaLabel || 'Stepper')}}\"")
    expect(markup).toContain('aria-label="Number"')
    expect(markup.match(/role="spinbutton"/g)).toHaveLength(4)
    expect(markup).toContain('aria-valuemin="{{min}}"')
    expect(markup).toContain('aria-valuemax="{{max}}"')
    expect(markup.match(/wx:else/g).length).toBeGreaterThan(0)
    expect(markup.split('wx:else')[1].split('Increase value')[0]).not.toContain('aria-valuenow')
    expect(markup).toContain('aria-readonly="{{readOnly ? \'true\' : \'false\'}}"')
    expect(markup).toContain('<text aria-hidden="true">−</text>')
    expect(markup).toContain('<text aria-hidden="true">+</text>')
    expect(markup).toContain('role="button"')
    expect(markup).toContain("aria-current=\"{{item.state === 'active' ? 'step' : 'false'}}\"")
    expect(markup).toContain('bindkeydown="onStepKey"')
    expect(markup).toContain('bindkeydown="onIncrementKey"')
    expect(markup).toContain('bindkeydown="onDecrementKey"')
    const named = await hostFor({ 'aria-label': 'Checkout', 'aria-labelledby': 'step-title' })
    expect(named.data.ariaLabel).toBe('Checkout')
    expect(named.data.labelledBy).toBe('step-title')
    named.setProperty('aria-labelledby', '')
    expect(named.data.labelledBy).toBe('')
    named.detached()
  })

  it('follows a later step and ignores a disabled step', async () => {
    const host = await hostFor({
      value: '0',
      items: [{ label: 'Account' }, { label: 'Ship' }, { label: 'Pay', disabled: true }],
    })
    expect(host.data.rows?.[0]?.state).toBe('active')
    expect(host.data.stepStatus).toBe('Step 1 of 3')
    host.onStepTap({ currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe('0')
    host.setProperty('value', '1')
    expect(host.data.current).toBe('1')
    expect(host.data.rows?.[1]?.state).toBe('active')
    expect(host.data.stepStatus).toBe('Step 2 of 3')
    host.setProperty('value', '2')
    expect(host.data.current).toBe('2')
    expect(host.data.rows?.[2]?.state).toBe('active')
    expect(host.data.stepStatus).toBe('Step 3 of 3')
    host.detached()
  })

  it('ignores typed changes while disabled or read-only', async () => {
    const disabled = await hostFor({ value: '1', disabled: true })
    disabled.onInput({ detail: { value: '9' } })
    disabled.onIncrementTap()
    expect(disabled.data.current).toBe('1')
    disabled.setProperty('value', '4')
    expect(disabled.data.current).toBe('4')
    disabled.detached()

    const frozen = await hostFor({ value: '2', readOnly: true })
    frozen.onInput({ detail: { value: '8' } })
    frozen.onIncrementTap()
    expect(frozen.data.current).toBe('2')
    frozen.detached()
  })

  it('asks the parent before leaving a controlled step', async () => {
    const host = await hostFor({
      value: '0',
      items: [{ label: 'Account' }, { label: 'Ship' }, { label: 'Pay' }],
    })
    host.onStepTap({ currentTarget: { dataset: { index: 1 } } })
    expect(host.data.current).toBe('0')
    expect(host.data.rows?.[0]?.state).toBe('active')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: 1 } })
    host.setProperty('value', '1')
    expect(host.data.current).toBe('1')
    expect(host.data.rows?.[1]?.state).toBe('active')
    host.setProperty('value', '')
    expect(host.data.current).toBe('')
    expect(host.data.rows?.every((row) => row.state === 'inactive')).toBe(true)
    expect(host.data.stepStatus).toBe('')
    host.onStepTap({ currentTarget: { dataset: { index: 0 } } })
    expect(host.data.current).toBe('')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: 0 } })
    host.detached()
  })

  it('starts at the default step and stays empty when the value is empty', async () => {
    const items = [{ label: 'Account' }, { label: 'Ship' }]
    const preset = await hostFor({ defaultValue: '1', items })
    expect(preset.data.current).toBe('1')
    expect(preset.data.rows?.[1]?.state).toBe('active')
    preset.detached()

    const held = await hostFor({ value: '', defaultValue: '1', items })
    expect(held.data.current).toBe('')
    expect(held.data.rows?.every((row) => row.state !== 'active')).toBe(true)
    held.onStepTap({ currentTarget: { dataset: { index: 0 } } })
    expect(held.data.current).toBe('')
    held.detached()
  })

  it('selects a step and ignores a disabled step', async () => {
    const host = await hostFor({
      items: [{ label: 'Account' }, { label: 'Ship' }, { label: 'Pay', disabled: true }],
    })
    expect(host.data.current).toBe('0')
    expect(host.data.rows?.[0]?.state).toBe('active')
    host.onStepKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { index: 1 } } })
    expect(host.data.current).toBe('1')
    expect(host.data.rows?.[1]?.state).toBe('active')
    expect(host.data.rows?.[0]?.state).toBe('completed')
    expect(host.events.at(-1)).toEqual({ name: 'change', detail: { value: 1 } })
    const count = host.events.length
    host.onStepTap({ currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe('1')
    expect(host.events).toHaveLength(count)

    const locked = await hostFor({
      items: [{ label: 'Account' }, { label: 'Ship' }],
      disabled: true,
    })
    locked.onStepTap({ currentTarget: { dataset: { index: 1 } } })
    expect(locked.data.current).toBe('0')
    host.detached()
    locked.detached()
  })

  it('selects the next enabled step with the axis arrows and Home or End', async () => {
    const items = [{ label: 'Account' }, { label: 'Ship', disabled: true }, { label: 'Pay' }]
    const host = await hostFor({ items })
    host.onStepKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { index: 0 } } })
    expect(host.data.current).toBe('2')
    host.onStepKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe('2')
    host.onStepKey({ detail: { key: 'ArrowDown' }, currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe('2')
    host.onStepKey({ detail: { key: 'Home' }, currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe('0')
    host.onStepKey({ detail: { key: 'End' }, currentTarget: { dataset: { index: 0 } } })
    expect(host.data.current).toBe('2')

    const vertical = await hostFor({
      orientation: 'vertical',
      items: [{ label: 'Account' }, { label: 'Ship' }],
    })
    vertical.onStepKey({ detail: { key: 'ArrowDown' }, currentTarget: { dataset: { index: 0 } } })
    expect(vertical.data.current).toBe('1')
    vertical.onStepKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { index: 1 } } })
    expect(vertical.data.current).toBe('1')

    const frozen = await hostFor({ readOnly: true, items: [{ label: 'Account' }, { label: 'Ship' }] })
    frozen.onStepKey({ detail: { key: 'ArrowRight' }, currentTarget: { dataset: { index: 0 } } })
    expect(frozen.data.current).toBe('0')
    host.detached()
    vertical.detached()
    frozen.detached()
  })

  it('keeps the active step inside min and max', async () => {
    const host = await hostFor({
      max: 1,
      items: [{ label: 'Account' }, { label: 'Ship' }, { label: 'Pay' }],
    })
    host.onStepTap({ currentTarget: { dataset: { index: 2 } } })
    expect(host.data.current).toBe('0')
    host.onStepTap({ currentTarget: { dataset: { index: 1 } } })
    expect(host.data.current).toBe('1')
    host.onIncrementKey({ detail: { key: ' ' } })
    expect(host.data.current).toBe('1')
    host.detached()
  })

  it('is horizontal unless orientation is vertical', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'stepper.wxml'), 'utf8')
    expect(markup).toContain(
      "data-orientation=\"{{orientation === 'vertical' ? 'vertical' : 'horizontal'}}\""
    )
    const host = await hostFor()
    expect(host.properties.orientation).toBe('horizontal')
    const vertical = await hostFor({ orientation: 'vertical' })
    expect(vertical.properties.orientation).toBe('vertical')
    host.detached()
    vertical.detached()
  })
})
