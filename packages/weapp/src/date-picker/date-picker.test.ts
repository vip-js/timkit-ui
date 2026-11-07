import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { open?: boolean; monthCount?: number; value?: string[]; dayStatus?: string }
  methods?: Record<string, (event?: { mark?: { offset?: number } }) => void>
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
  await import(pathToFileURL(path.join(__dirname, 'date-picker.ts')).href)
  if (!captured) throw new Error('date picker component was not registered')
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
    events: [] as Array<{ name: string; detail?: { value?: string[] } }>,
    triggerEvent(name: string, detail?: { value?: string[] }) {
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
    onOpen: () => void
    onTriggerKey: (event?: { detail?: { key?: string } }) => void
    onClose: () => void
    onSelectDay: (event?: { mark?: { offset?: number } }) => void
    onSelectDate: (event?: { mark?: { value?: string } }) => void
    onNext: () => void
    onPrev: () => void
    onNextKey: (event?: { detail?: { key?: string } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string[] } }>
  }
}

describe('weapp date picker', () => {
  it('renders the day grid after it opens', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'date-picker.wxml'), 'utf8')
    expect(markup).toContain('role="button"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain("tabindex=\"{{!disabled && !item.disabled && item.focused ? 0 : -1}}\"")
    expect(markup).toContain("tabindex=\"{{!disabled && canPrev ? 0 : -1}}\"")
    expect(markup).toContain("tabindex=\"{{!disabled && canNext ? 0 : -1}}\"")
    expect(markup).toContain('aria-haspopup="grid"')
    expect(markup).toContain('wx:if="{{open}}"')
    expect(markup).toContain('aria-controls="{{id}}-content"')
    expect(markup.split('wx:else')[1].split('id="{{id}}-content"')[0]).not.toContain('aria-controls')
    expect(markup).toContain('id="{{id}}-content" role="application" tabindex="-1"')
    expect(markup).toContain("aria-readonly=\"{{readOnly ? 'true' : 'false'}}\" aria-disabled=\"{{disabled ? 'true' : 'false'}}\"")
    expect(markup).toContain('role="grid" aria-label="{{caption}}" tabindex="-1" aria-disabled="{{disabled ? \'true\' : \'false\'}}" aria-readonly="{{readOnly ? \'true\' : \'false\'}}" aria-roledescription="calendar month" aria-multiselectable="{{mode === \'range\' ? \'true\' : \'false\'}}"')
    expect(markup).toContain('role="row" aria-disabled="{{disabled ? \'true\' : \'false\'}}"')
    expect(markup).toContain("aria-expanded=\"{{open ? 'true' : 'false'}}\"")
    expect(markup).toContain("aria-required=\"{{required ? 'true' : 'false'}}\"")
    expect(markup).toContain('aria-label="{{triggerLabel}}"')
    expect(markup).toContain('bindkeydown="onNextKey"')
    expect(markup).toContain('bindtap="onSelectDate"\n          bindkeydown="onKey"')
    expect(markup).toContain('bindkeydown="onPrevKey"')
    expect(markup).toContain('role="grid"')
    expect(markup).toContain('wx:for="{{weeks}}"')
    expect(markup).toContain('aria-label="{{item.name}}"')
    expect(markup).toContain('role="columnheader"')
    expect(markup).toContain('wx:if="{{open}}"')
    const host = await hostFor()
    expect(host.data.open).toBe(false)
    expect(host.data.triggerLabel).toBe('Open calendar')
    host.onOpen()
    expect(host.data.open).toBe(true)
    expect(host.data.triggerLabel).toBe('Close calendar')
    expect(host.data.prevLabel).toBe('Switch to previous month')
    expect(host.data.nextLabel).toBe('Switch to next month')
    expect(host.data.weekdays).toHaveLength(7)
    const caption = host.data.caption
    host.onNextKey({ detail: { key: 'Enter' } })
    expect(host.data.caption).not.toBe(caption)
    const focused = host.data.days.find((item) => item.focused)?.value
    host.onKey({ detail: { key: 'ArrowRight' } })
    expect(host.data.days.find((item) => item.focused)?.value).not.toBe(focused)
    const target = host.data.days.find((item) => item.focused)?.value
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.days.find((item) => item.value === target)?.selected).toBe(true)
    expect(host.data.value).toHaveLength(1)
    expect(host.data.open).toBe(true)
    expect(host.data.days.length).toBeGreaterThan(27)
    const day = host.data.days.find((item) => !item.disabled && !item.outside)
    host.onSelectDate({ mark: { value: day?.value } })
    expect(host.data.value).toHaveLength(1)
    expect(host.data.open).toBe(true)
  })

  it('follows a later value and keeps that day while disabled', async () => {
    const host = await hostFor({ value: ['2026-11-01'] })
    expect(host.data.value).toEqual(['11/01/2026'])
    expect(host.data.dayStatus).toBe('2026-11-01')
    host.setData({ value: ['2026-11-07'] })
    expect(host.data.value).toEqual(['11/07/2026'])
    expect(host.data.dayStatus).toBe('2026-11-07')
    host.setProperty('value', [])
    expect(host.data.value).toEqual([])
    expect(host.data.dayStatus).toBe('')
    host.onOpen()
    host.onSelectDay({ mark: { offset: 1 } })
    expect(host.data.value).toEqual([])
    const asked = host.events.at(-1)?.detail?.value
    expect(asked?.[0]).toBeTruthy()
    host.setProperty('value', asked)
    expect(host.data.value).toHaveLength(1)

    const disabled = await hostFor({ disabled: true, value: ['2026-11-01'] })
    expect(disabled.data.value).toEqual(['11/01/2026'])
    disabled.onOpen()
    disabled.onSelectDay({ mark: { offset: 0 } })
    expect(disabled.data.value).toEqual(['11/01/2026'])
    expect(disabled.data.open).toBe(false)
  })

  it('selects the default day and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: ['2026-11-01'], open: true })
    expect(preset.data.value).toEqual(['11/01/2026'])

    const held = await hostFor({ value: [], defaultValue: ['2026-11-01'], open: true })
    expect(held.data.value).toEqual([])
    held.onSelectDay({ mark: { offset: 0 } })
    expect(held.data.value).toEqual([])
  })

  it('starts open from the default and stays shut when open is false', async () => {
    const preset = await hostFor({ defaultOpen: true })
    expect(preset.data.open).toBe(true)
    preset.onClose()
    expect(preset.data.open).toBe(false)

    const held = await hostFor({ open: false, defaultOpen: true })
    expect(held.data.open).toBe(false)
    held.onOpen()
    expect(held.data.open).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'openChange', detail: { open: true } })
  })

  it('opens, shows the requested months, and selects one day', async () => {
    const held = await hostFor({ open: false })
    held.onOpen()
    expect(held.data.open).toBe(false)
    expect(held.events.at(-1)).toEqual({ name: 'openChange', detail: { open: true } })
    held.setProperty('open', true)
    expect(held.data.open).toBe(true)
    held.onClose()
    expect(held.data.open).toBe(true)
    expect(held.events.at(-1)).toEqual({ name: 'openChange', detail: { open: false } })

    const host = await hostFor({ numberOfMonths: 2 })
    expect(host.data.open).toBe(false)
    host.onOpen()
    expect(host.data.open).toBe(true)
    expect(host.data.monthCount).toBe(2)
    host.onSelectDay({ mark: { offset: 0 } })
    expect(host.data.value).toHaveLength(1)
    host.onClose()
    expect(host.data.open).toBe(false)
  })

  it('ignores a disabled day after the picker opens', async () => {
    const sample = await hostFor()
    sample.onOpen()
    sample.onSelectDay({ mark: { offset: 0 } })
    const blocked = sample.data.value?.[0]
    expect(blocked).toBeTruthy()

    const host = await hostFor({ disabledDates: [blocked] })
    host.onOpen()
    host.onSelectDay({ mark: { offset: 0 } })
    expect(host.data.value).toEqual([])
    host.onSelectDay({ mark: { offset: 1 } })
    expect(host.data.value).toHaveLength(1)
  })

  it('keeps a start and an end in range mode', async () => {
    const open = await hostFor({ mode: 'range', defaultOpen: true })
    expect(open.data.open).toBe(true)
    open.onSelectDay({ mark: { offset: 0 } })
    open.onSelectDay({ mark: { offset: 2 } })
    expect(open.data.value).toHaveLength(2)
    expect(open.data.displayValue).toContain(' - ')
    expect(open.data.open).toBe(true)
    open.onSelectDay({ mark: { offset: 4 } })
    expect(open.data.value).toHaveLength(1)
    expect(open.data.displayValue).not.toContain(' - ')

    const held = await hostFor({ mode: 'range', value: [], defaultOpen: true })
    held.onSelectDay({ mark: { offset: 0 } })
    const start = held.events.at(-1)?.detail?.value as string[]
    expect(start).toHaveLength(1)
    held.setProperty('value', start)
    held.onSelectDay({ mark: { offset: 2 } })
    const range = held.events.at(-1)?.detail?.value as string[]
    expect(range).toHaveLength(2)
    expect(range[0] <= range[1]).toBe(true)
  })

  it('ignores open and select while disabled', async () => {
    const host = await hostFor({ disabled: true })
    host.onOpen()
    host.onSelectDay({ mark: { offset: 0 } })
    expect(host.data.open).toBe(false)
    expect(host.data.value).toEqual([])
  })

  it('opens while read-only, ignores selection, and still follows a later value', async () => {
    const host = await hostFor({ readOnly: true })
    host.onOpen()
    expect(host.data.open).toBe(true)
    host.onSelectDay({ mark: { offset: 0 } })
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.value).toEqual([])
    expect(host.events).toEqual([])
    host.setProperty('value', ['2026-11-07'])
    expect(host.data.value).toEqual(['11/07/2026'])
  })

  it('stops month changes and day selection outside start and end', async () => {
    const host = await hostFor({ startMonth: '2026-11-01', endMonth: '2026-12-01' })
    host.onOpen()
    const view = host.data as { caption?: string; canPrev?: boolean; canNext?: boolean; value?: string[] }
    const opened = view.caption
    expect(opened).toContain('2026')
    host.onPrev()
    expect(view.caption).toBe(opened)
    expect(view.canPrev).toBe(false)
    host.onNext()
    expect(view.caption).not.toBe(opened)
    const december = view.caption
    host.onNext()
    expect(view.caption).toBe(december)
    expect(view.canNext).toBe(false)
    host.onSelectDate({ mark: { value: '2026-10-15' } })
    expect(view.value ?? []).toEqual([])
    host.onSelectDate({ mark: { value: '2026-12-15' } })
    expect(view.value ?? []).not.toEqual([])
  })

  it('opens from the trigger keys, closes on Escape, and stays shut while disabled', async () => {
    const host = await hostFor()
    expect(host.data.open).toBe(false)
    host.onTriggerKey({ detail: { key: 'Enter' } })
    expect(host.data.open).toBe(true)
    host.onKey({ detail: { key: 'Escape' } })
    expect(host.data.open).toBe(false)
    host.onTriggerKey({ detail: { key: ' ' } })
    expect(host.data.open).toBe(true)
    const disabled = await hostFor({ disabled: true })
    disabled.onTriggerKey({ detail: { key: 'Enter' } })
    expect(disabled.data.open).toBe(false)
  })

  it('moves across the open month with Home and End without selecting a day', async () => {
    const focusedValue = (host: { data: { days?: Array<{ focused?: boolean; value: string; selected?: boolean }> } }) =>
      host.data.days?.find((item) => item.focused)?.value ?? ''
    const host = await hostFor()
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.open).toBe(false)
    host.onOpen()
    host.onKey({ detail: { key: 'Home' } })
    const home = focusedValue(host)
    expect(home.endsWith('-01')).toBe(true)
    host.onKey({ detail: { key: 'End' } })
    const end = focusedValue(host)
    const [year, month] = home.split('-').map(Number)
    const last = new Date(year, month, 0).getDate()
    expect(end).toBe(`${home.slice(0, 8)}${String(last).padStart(2, '0')}`)
    expect(host.data.value ?? []).toEqual([])
    expect(host.data.open).toBe(true)
    expect(host.data.days?.find((item) => item.value === end)?.selected).not.toBe(true)
  })

  it('moves the open month with PageUp and PageDown without selecting a day', async () => {
    const host = await hostFor()
    const closed = host.data.caption
    host.onKey({ detail: { key: 'PageDown' } })
    expect(host.data.open).toBe(false)
    expect(host.data.caption).toBe(closed)
    host.onOpen()
    host.onKey({ detail: { key: 'PageDown' } })
    expect(host.data.caption).not.toBe(closed)
    expect(host.data.value ?? []).toEqual([])
    expect(host.data.open).toBe(true)
    host.onKey({ detail: { key: 'PageUp' } })
    expect(host.data.caption).toBe(closed)
    expect(host.data.value ?? []).toEqual([])
  })

  it('moves the open calendar by a year with Shift and PageUp or PageDown without selecting a day', async () => {
    const host = await hostFor()
    const closed = host.data.caption
    host.onKey({ detail: { key: 'PageDown', shiftKey: true } })
    expect(host.data.open).toBe(false)
    expect(host.data.caption).toBe(closed)
    host.onOpen()
    host.onKey({ detail: { key: 'PageDown', shiftKey: true } })
    expect(host.data.caption).toContain('2027')
    expect(host.data.value ?? []).toEqual([])
    expect(host.data.open).toBe(true)
    host.onKey({ detail: { key: 'PageUp', shiftKey: true } })
    expect(host.data.caption).toBe(closed)
    const frozen = await hostFor({ readOnly: true })
    frozen.onOpen()
    frozen.onKey({ detail: { key: 'PageDown', shiftKey: true } })
    expect(frozen.data.caption).toContain('2027')
    expect(frozen.data.value ?? []).toEqual([])
    expect(frozen.data.open).toBe(true)
  })

  it('moves a week in the open month with ArrowDown and ArrowUp without selecting a day', async () => {
    const focusedValue = (host: { data: { days?: Array<{ focused?: boolean; value: string; selected?: boolean }> } }) =>
      host.data.days?.find((item) => item.focused)?.value ?? ''
    const dayNumber = (value: string) => Number(value.slice(-2))
    const host = await hostFor()
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.open).toBe(false)
    host.onOpen()
    host.onKey({ detail: { key: 'Home' } })
    const home = focusedValue(host)
    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(dayNumber(focusedValue(host))).toBe(dayNumber(home) + 7)
    expect(host.data.value ?? []).toEqual([])
    expect(host.data.open).toBe(true)
    host.onKey({ detail: { key: 'ArrowUp' } })
    expect(focusedValue(host)).toBe(home)
    expect(host.data.value ?? []).toEqual([])
  })
})
