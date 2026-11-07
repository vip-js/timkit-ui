import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'

type ComponentDefinition = {
  data?: { monthCount?: number; value?: string[]; dayStatus?: string }
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
  await import(pathToFileURL(path.join(__dirname, 'calendar.ts')).href)
  if (!captured) throw new Error('calendar component was not registered')
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
    onSelectDay: (event?: { mark?: { offset?: number } }) => void
    onSelectDate: (event?: { mark?: { value?: string } }) => void
    onNext: () => void
    onNextKey: (event?: { detail?: { key?: string } }) => void
    onKey: (event?: { detail?: { key?: string } }) => void
    setProperty: (key: string, value: unknown) => void
    events: Array<{ name: string; detail?: { value?: string[] } }>
  }
}

describe('weapp calendar', () => {
  it('renders a month grid of selectable days', async () => {
    const markup = fs.readFileSync(path.join(__dirname, 'calendar.wxml'), 'utf8')
    expect(markup.split('role="grid"')[0]).not.toContain('aria-readonly')
    expect(markup).toContain('role="grid" aria-label="{{caption}}" tabindex="-1" aria-disabled="{{disabled ? \'true\' : \'false\'}}" aria-readonly="{{readOnly ? \'true\' : \'false\'}}" aria-roledescription="calendar month" aria-multiselectable="{{mode === \'range\' ? \'true\' : \'false\'}}"')
    expect(markup).toContain('role="row" aria-disabled="{{disabled ? \'true\' : \'false\'}}"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('role="columnheader"')
    expect(markup).toContain('role="gridcell"')
    expect(markup).toContain('wx:for="{{weeks}}"')
    expect(markup).toContain("tabindex=\"{{!disabled && !item.disabled && item.focused ? 0 : -1}}\"")
    expect(markup).toContain("tabindex=\"{{!disabled && canPrev ? 0 : -1}}\"")
    expect(markup).toContain("tabindex=\"{{!disabled && canNext ? 0 : -1}}\"")
    expect(markup).toContain('aria-label="{{item.name}}"')
    expect(markup).toContain("aria-current=\"{{item.today ? 'date' : 'false'}}\"")
    expect(markup).toContain('bindtap="onSelectDate"\n        bindkeydown="onKey"')
    expect(markup).toContain('bindtap="onSelectDate"')
    expect(markup).toContain('aria-label="{{nextLabel}}"')
    expect(markup).toContain('aria-label="{{prevLabel}}"')
    expect(markup).toContain('bindkeydown="onNextKey"')
    expect(markup).toContain('bindkeydown="onPrevKey"')
    const host = await hostFor()
    expect(host.data.weekdays).toHaveLength(7)
    expect(host.data.weeks?.length).toBeGreaterThan(3)
    expect(host.data.weeks?.[0]).toHaveLength(7)
    expect(host.data.prevLabel).toBe('Switch to previous month')
    expect(host.data.nextLabel).toBe('Switch to next month')
    const named = host.data.days.find((item) => item.name && item.name !== item.label)
    expect(named?.name).toBeTruthy()
    const caption = host.data.caption
    expect(caption).toBeTruthy()
    host.onNextKey({ detail: { key: 'Enter' } })
    expect(host.data.caption).not.toBe(caption)
    const disabled = await hostFor({ disabled: true })
    const locked = disabled.data.caption
    disabled.onNextKey({ detail: { key: ' ' } })
    expect(disabled.data.caption).toBe(locked)
    const focused = host.data.days.find((item) => item.focused)?.value
    host.onKey({ detail: { key: 'ArrowRight' } })
    expect(host.data.days.find((item) => item.focused)?.value).not.toBe(focused)
    const target = host.data.days.find((item) => item.focused)?.value
    host.onKey({ detail: { key: 'Enter' } })
    expect(host.data.days.find((item) => item.value === target)?.selected).toBe(true)
    expect(host.data.value).toHaveLength(1)
    const frozen = await hostFor({ readOnly: true })
    const frozenFocus = frozen.data.days.find((item) => item.focused)?.value
    frozen.onKey({ detail: { key: 'Enter' } })
    expect(frozen.data.value ?? []).toEqual([])
    frozen.onKey({ detail: { key: 'ArrowRight' } })
    expect(frozen.data.days.find((item) => item.focused)?.value).not.toBe(frozenFocus)
    disabled.onKey({ detail: { key: 'Enter' } })
    expect(disabled.data.value ?? []).toEqual([])
    const lockedFocus = disabled.data.days.find((item) => item.focused)?.value
    disabled.onKey({ detail: { key: 'ArrowRight' } })
    expect(disabled.data.days.find((item) => item.focused)?.value).toBe(lockedFocus)
    expect(host.data.days.length).toBeGreaterThan(27)
    const day = host.data.days.find((item) => !item.disabled && !item.outside)
    expect(day?.value).toBeTruthy()
    host.onSelectDate({ mark: { value: day?.value } })
    expect(host.data.value).toHaveLength(1)
    const blocked = await hostFor({ disabledDates: [day?.value] })
    expect(blocked.data.days.find((item) => item.value === day?.value)?.disabled).toBe(true)
    blocked.onSelectDate({ mark: { value: day?.value } })
    expect(blocked.data.value).toEqual([])
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
    host.onSelectDay({ mark: { offset: 1 } })
    expect(host.data.value).toEqual([])
    const asked = host.events.at(-1)?.detail?.value
    expect(asked?.[0]).toBeTruthy()
    host.setProperty('value', asked)
    expect(host.data.value).toHaveLength(1)

    const disabled = await hostFor({ disabled: true, value: ['2026-11-01'] })
    expect(disabled.data.value).toEqual(['11/01/2026'])
    disabled.onSelectDay({ mark: { offset: 0 } })
    expect(disabled.data.value).toEqual(['11/01/2026'])
  })

  it('selects the default day and stays empty when the value is empty', async () => {
    const preset = await hostFor({ defaultValue: ['2026-11-01'] })
    expect(preset.data.value).toEqual(['11/01/2026'])

    const held = await hostFor({ value: [], defaultValue: ['2026-11-01'] })
    expect(held.data.value).toEqual([])
    held.onSelectDay({ mark: { offset: 0 } })
    expect(held.data.value).toEqual([])
  })

  it('keeps a start and an end in range mode', async () => {
    const open = await hostFor({ mode: 'range' })
    open.onSelectDay({ mark: { offset: 0 } })
    open.onSelectDay({ mark: { offset: 2 } })
    expect(open.data.value).toHaveLength(2)
    const marked = open.data.days.filter((day) => day.selected)
    expect(marked.length).toBeGreaterThan(1)
    open.onSelectDay({ mark: { offset: 4 } })
    expect(open.data.value).toHaveLength(1)

    const held = await hostFor({ mode: 'range', value: [] })
    held.onSelectDay({ mark: { offset: 0 } })
    const start = held.events.at(-1)?.detail?.value as string[]
    expect(start).toHaveLength(1)
    held.setProperty('value', start)
    held.onSelectDay({ mark: { offset: 2 } })
    const range = held.events.at(-1)?.detail?.value as string[]
    expect(range).toHaveLength(2)
    expect(range[0] <= range[1]).toBe(true)
    held.setProperty('value', range)
    held.onSelectDay({ mark: { offset: 4 } })
    expect(held.events.at(-1)?.detail?.value).toHaveLength(1)
  })

  it('keeps one day in single mode and every day in multiple mode', async () => {
    const single = await hostFor({ mode: 'single' })
    single.onSelectDay({ mark: { offset: 0 } })
    single.onSelectDay({ mark: { offset: 1 } })
    expect(single.data.value).toHaveLength(1)

    const multiple = await hostFor({ mode: 'multiple' })
    multiple.onSelectDay({ mark: { offset: 0 } })
    multiple.onSelectDay({ mark: { offset: 1 } })
    expect(multiple.data.value).toHaveLength(2)
  })

  it('ignores a disabled day and still selects the next day', async () => {
    const sample = await hostFor()
    sample.onSelectDay({ mark: { offset: 0 } })
    const blocked = sample.data.value?.[0]
    expect(blocked).toBeTruthy()

    const host = await hostFor({ disabledDates: [blocked] })
    host.onSelectDay({ mark: { offset: 0 } })
    expect(host.data.value).toEqual([])
    host.onSelectDay({ mark: { offset: 1 } })
    expect(host.data.value).toHaveLength(1)
  })

  it('shows the requested number of months and ignores selection while disabled', async () => {
    const months = await hostFor({ numberOfMonths: 2 })
    expect(months.data.monthCount).toBe(2)

    const disabled = await hostFor({ disabled: true })
    disabled.onSelectDay({ mark: { offset: 0 } })
    expect(disabled.data.value).toEqual([])
  })

  it('ignores a day press while read-only and still follows a later value', async () => {
    const frozen = await hostFor({ readOnly: true })
    frozen.onSelectDay({ mark: { offset: 0 } })
    expect(frozen.data.value).toEqual([])
    frozen.setProperty('value', ['2026-11-07'])
    expect(frozen.data.value).toEqual(['11/07/2026'])
  })

  it('moves to the first and last day of the visible month with Home and End without selecting them', async () => {
    const focusedValue = (host: { data: { days: Array<{ focused?: boolean; value: string; selected?: boolean }> } }) =>
      host.data.days.find((item) => item.focused)?.value ?? ''
    const host = await hostFor()
    const selected = [...(host.data.value ?? [])]
    host.onKey({ detail: { key: 'Home' } })
    const home = focusedValue(host)
    expect(home.endsWith('-01')).toBe(true)
    expect(host.data.days.find((item) => item.value === home)?.selected).not.toBe(true)
    host.onKey({ detail: { key: 'End' } })
    const end = focusedValue(host)
    const [year, month] = home.split('-').map(Number)
    const last = new Date(year, month, 0).getDate()
    expect(end).toBe(`${home.slice(0, 8)}${String(last).padStart(2, '0')}`)
    expect(host.data.value ?? []).toEqual(selected)
    expect(host.data.days.find((item) => item.value === end)?.selected).not.toBe(true)

    const disabled = await hostFor({ disabled: true })
    const locked = focusedValue(disabled)
    disabled.onKey({ detail: { key: 'End' } })
    expect(focusedValue(disabled)).toBe(locked)

    const frozen = await hostFor({ readOnly: true })
    const before = focusedValue(frozen)
    frozen.onKey({ detail: { key: 'End' } })
    expect(focusedValue(frozen)).not.toBe(before)
    expect(frozen.data.value ?? []).toEqual([])
  })

  it('moves to the previous and next month with PageUp and PageDown without selecting a day', async () => {
    const captionOf = (host: { data: { caption?: string; value?: string[] } }) => host.data.caption ?? ''
    const host = await hostFor()
    const selected = [...(host.data.value ?? [])]
    const opened = captionOf(host)
    host.onKey({ detail: { key: 'PageDown' } })
    expect(captionOf(host)).not.toBe(opened)
    expect(host.data.value ?? []).toEqual(selected)
    host.onKey({ detail: { key: 'PageUp' } })
    expect(captionOf(host)).toBe(opened)
    expect(host.data.value ?? []).toEqual(selected)

    const disabled = await hostFor({ disabled: true })
    const locked = captionOf(disabled)
    disabled.onKey({ detail: { key: 'PageDown' } })
    expect(captionOf(disabled)).toBe(locked)

    const frozen = await hostFor({ readOnly: true })
    const frozenCaption = captionOf(frozen)
    frozen.onKey({ detail: { key: 'PageDown' } })
    expect(captionOf(frozen)).not.toBe(frozenCaption)
    expect(frozen.data.value ?? []).toEqual([])
  })

  it('moves by a year with Shift and PageUp or PageDown without selecting a day', async () => {
    const captionOf = (host: { data: { caption?: string; value?: string[] } }) => host.data.caption ?? ''
    const host = await hostFor()
    const selected = [...(host.data.value ?? [])]
    const opened = captionOf(host)
    host.onKey({ detail: { key: 'PageDown', shiftKey: true } })
    expect(captionOf(host)).toContain('2027')
    expect(captionOf(host)).toContain(opened.replace(/\d{4}/, '').trim().split(' ')[0] || opened)
    expect(host.data.value ?? []).toEqual(selected)
    host.onKey({ detail: { key: 'PageUp', shiftKey: true } })
    expect(captionOf(host)).toBe(opened)

    const disabled = await hostFor({ disabled: true })
    const locked = captionOf(disabled)
    disabled.onKey({ detail: { key: 'PageDown', shiftKey: true } })
    expect(captionOf(disabled)).toBe(locked)

    const frozen = await hostFor({ readOnly: true })
    frozen.onKey({ detail: { key: 'PageDown', shiftKey: true } })
    expect(captionOf(frozen)).toContain('2027')
    expect(frozen.data.value ?? []).toEqual([])
  })

  it('moves by a week with ArrowDown and ArrowUp without selecting a day', async () => {
    const focusedValue = (host: { data: { days: Array<{ focused?: boolean; value: string; selected?: boolean }> } }) =>
      host.data.days.find((item) => item.focused)?.value ?? ''
    const dayNumber = (value: string) => Number(value.slice(-2))
    const host = await hostFor()
    const selected = [...(host.data.value ?? [])]
    host.onKey({ detail: { key: 'Home' } })
    const home = focusedValue(host)
    host.onKey({ detail: { key: 'ArrowDown' } })
    const next = focusedValue(host)
    expect(dayNumber(next)).toBe(dayNumber(home) + 7)
    expect(host.data.value ?? []).toEqual(selected)
    expect(host.data.days.find((item) => item.value === next)?.selected).not.toBe(true)
    host.onKey({ detail: { key: 'ArrowUp' } })
    expect(focusedValue(host)).toBe(home)
    expect(host.data.value ?? []).toEqual(selected)

    const disabled = await hostFor({ disabled: true })
    const locked = focusedValue(disabled)
    disabled.onKey({ detail: { key: 'ArrowDown' } })
    expect(focusedValue(disabled)).toBe(locked)

    const frozen = await hostFor({ readOnly: true })
    frozen.onKey({ detail: { key: 'Home' } })
    const frozenHome = focusedValue(frozen)
    frozen.onKey({ detail: { key: 'ArrowDown' } })
    expect(dayNumber(focusedValue(frozen))).toBe(dayNumber(frozenHome) + 7)
    expect(frozen.data.value ?? []).toEqual([])
  })

  it('stops month changes and day selection outside start and end', async () => {
    const host = await hostFor({ startMonth: '2026-11-01', endMonth: '2026-12-01' })
    const caption = () => (host.data as { caption?: string }).caption
    const opened = caption()
    expect(opened).toContain('2026')
    host.onPrev()
    expect(caption()).toBe(opened)
    expect(host.data.canPrev).toBe(false)
    host.onNext()
    expect(caption()).not.toBe(opened)
    const december = caption()
    host.onNext()
    expect(caption()).toBe(december)
    expect(host.data.canNext).toBe(false)
    host.onSelectDate({ mark: { value: '2026-10-15' } })
    expect(host.data.value ?? []).toEqual([])
    host.onSelectDate({ mark: { value: '2026-12-15' } })
    expect(host.data.value ?? []).not.toEqual([])
  })
})
