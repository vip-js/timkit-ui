// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Calendar } from './calendar'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (mode: 'single' | 'multiple' | 'range', disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(<Calendar mode={mode} disabled={disabled} showOutsideDays={false} />))
  mounted.push({ root, host })
}

const days = () =>
  [...document.querySelectorAll('[data-slot="calendar"] button[data-view="day"]')].filter(
    (button) => !button.hasAttribute('data-outside-range')
  )

const press = async (index: number) => {
  await act(async () => {
    ;(days()[index] as HTMLButtonElement | undefined)?.click()
  })
}

const selected = () => document.querySelectorAll('[data-slot="calendar"] button[data-selected]').length

const selectedLabel = () =>
  document.querySelector('[data-slot="calendar"] button[data-selected]')?.textContent?.trim()

describe('calendar mode', () => {
  it('marks today with aria-current date', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 7, 12))
    try {
      show('single')
      const today = document.querySelector('[data-slot="calendar"] button[aria-current="date"]')
      expect(today?.textContent?.trim()).toBe('7')
      expect(document.querySelectorAll('[data-slot="calendar"] button[aria-current="date"]')).toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('follows a later selected date', async () => {
    function Harness() {
      const [day, setDay] = useState<Date | null>(() => new Date(2026, 10, 1))
      return (
        <>
          <button type="button" onClick={() => setDay(new Date(2026, 10, 7))}>
            Next
          </button>
          <button type="button" onClick={() => setDay(null)}>
            Clear
          </button>
          <Calendar mode="single" selected={day} showOutsideDays={false} />
        </>
      )
    }
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<Harness />))
    mounted.push({ root, host })
    expect(selectedLabel()).toBe('1')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2026-11-01')
    const next = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Next')
    await act(async () => {
      next?.click()
    })
    expect(selectedLabel()).toBe('7')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2026-11-07')
    const clear = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    await act(async () => {
      clear?.click()
    })
    expect(selected()).toBe(0)
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  it('keeps one day when mode is single', async () => {
    show('single')
    await press(0)
    await press(1)
    expect(selected()).toBe(1)
  })

  it('keeps every pressed day when mode is multiple', async () => {
    show('multiple')
    await press(0)
    await press(1)
    expect(selected()).toBe(2)
  })

  it('keeps a start and an end when mode is range', async () => {
    show('range')
    await press(0)
    await press(2)
    expect(selected()).toBeGreaterThan(1)
    await press(4)
    expect(selected()).toBe(1)
  })

  it('ignores a disabled day', async () => {
    const first = new Date()
    first.setDate(1)
    first.setHours(0, 0, 0, 0)
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<Calendar mode="single" disabled={first} showOutsideDays={false} />))
    mounted.push({ root, host })
    await press(0)
    expect(selected()).toBe(0)
    expect(days()[0]?.hasAttribute('disabled')).toBe(true)
    await press(1)
    expect(selected()).toBe(1)
  })

  it('ignores presses while disabled', async () => {
    show('single', true)
    await press(0)
    expect(selected()).toBe(0)
  })

  it('ignores a day press while read-only', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<Calendar mode="single" readOnly showOutsideDays={false} />))
    mounted.push({ root, host })
    const day = days()[0] as HTMLButtonElement
    expect(day.disabled).toBe(false)
    await press(0)
    expect(selected()).toBe(0)
  })

  it('stops at the end month and does not move before the start month', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <Calendar
          mode="single"
          defaultMonth={new Date(2026, 10, 1)}
          startMonth={new Date(2026, 10, 1)}
          endMonth={new Date(2026, 11, 1)}
          showOutsideDays={false}
        />
      )
    )
    mounted.push({ root, host })
    const text = () => document.querySelector('[data-slot="calendar"]')?.textContent ?? ''
    expect(document.querySelector('[data-slot="calendar"] table')?.getAttribute('aria-label')).toContain(
      'November'
    )
    const next = () =>
      [...document.querySelectorAll('[data-slot="calendar"] button')].find((button) =>
        /next/i.test(button.getAttribute('aria-label') ?? '')
      ) as HTMLButtonElement | undefined
    const previous = () =>
      [...document.querySelectorAll('[data-slot="calendar"] button')].find((button) =>
        /prev/i.test(button.getAttribute('aria-label') ?? '')
      ) as HTMLButtonElement | undefined
    expect(text()).toContain('November')
    expect(previous()?.disabled).toBe(true)
    await act(async () => {
      previous()?.click()
    })
    expect(text()).toContain('November')
    await act(async () => {
      next()?.click()
    })
    expect(text()).toContain('December')
    expect(next()?.disabled).toBe(true)
    await act(async () => {
      next()?.click()
    })
    expect(text()).toContain('December')
  })

  it('moves to the first and last day of the visible month with Home and End without selecting them', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <>
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} disabled />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} readOnly />
        </>
      )
    )
    mounted.push({ root, host })
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const focused = (index: number) => grid(index).querySelector('[data-focus]')?.textContent?.trim() ?? ''
    const table = (index: number) => grid(index).querySelector('table') as HTMLElement
    const pressKey = async (index: number, key: string) => {
      await act(async () => {
        table(index).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    }
    expect(grid(0).querySelector('table')?.getAttribute('aria-label')).toContain('November')
    await pressKey(0, 'Home')
    expect(focused(0)).toBe('1')
    expect(grid(0).querySelector('[data-selected]')).toBeNull()
    await pressKey(0, 'End')
    expect(focused(0)).toBe('30')
    expect(grid(0).querySelector('[data-selected]')).toBeNull()
    const locked = focused(1)
    await pressKey(1, 'End')
    expect(focused(1)).toBe(locked)
    await pressKey(2, 'End')
    expect(focused(2)).toBe('30')
    expect(grid(2).querySelector('[data-selected]')).toBeNull()
  })

  it('moves to the previous and next month with PageUp and PageDown without selecting a day', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <>
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} disabled />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} readOnly />
        </>
      )
    )
    mounted.push({ root, host })
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const label = (index: number) => grid(index).querySelector('table')?.getAttribute('aria-label') ?? ''
    const pressKey = async (index: number, key: string) => {
      await act(async () => {
        grid(index).querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    }
    expect(label(0)).toContain('November')
    await pressKey(0, 'PageDown')
    expect(label(0)).toContain('December')
    expect(grid(0).querySelector('[data-selected]')).toBeNull()
    await pressKey(0, 'PageUp')
    expect(label(0)).toContain('November')
    expect(grid(0).querySelector('[data-selected]')).toBeNull()
    const locked = label(1)
    await pressKey(1, 'PageDown')
    expect(label(1)).toBe(locked)
    await pressKey(2, 'PageDown')
    expect(label(2)).toContain('December')
    expect(grid(2).querySelector('[data-selected]')).toBeNull()
  })

  it('moves by a year with Shift and PageUp or PageDown without selecting a day', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <>
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} disabled />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} readOnly />
        </>
      )
    )
    mounted.push({ root, host })
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const label = (index: number) => grid(index).querySelector('table')?.getAttribute('aria-label') ?? ''
    const pressKey = async (index: number, key: string, shiftKey = false) => {
      await act(async () => {
        grid(index)
          .querySelector('table')
          ?.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
      })
    }
    expect(label(0)).toContain('November 2026')
    await pressKey(0, 'PageDown', true)
    expect(label(0)).toContain('November 2027')
    expect(grid(0).querySelector('[data-selected]')).toBeNull()
    await pressKey(0, 'PageUp', true)
    expect(label(0)).toContain('November 2026')
    const locked = label(1)
    await pressKey(1, 'PageDown', true)
    expect(label(1)).toBe(locked)
    await pressKey(2, 'PageDown', true)
    expect(label(2)).toContain('November 2027')
    expect(grid(2).querySelector('[data-selected]')).toBeNull()
  })

  it('moves by a week with ArrowDown and ArrowUp without selecting a day', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <>
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} disabled />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} readOnly />
        </>
      )
    )
    mounted.push({ root, host })
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const focused = (index: number) => grid(index).querySelector('[data-focus]')?.textContent?.trim() ?? ''
    const pressKey = async (index: number, key: string) => {
      await act(async () => {
        grid(index).querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    }
    await pressKey(0, 'Home')
    expect(focused(0)).toBe('1')
    await pressKey(0, 'ArrowDown')
    expect(focused(0)).toBe('8')
    expect(grid(0).querySelector('[data-selected]')).toBeNull()
    await pressKey(0, 'ArrowUp')
    expect(focused(0)).toBe('1')
    expect(grid(0).querySelector('[data-selected]')).toBeNull()
    const locked = focused(1)
    await pressKey(1, 'ArrowDown')
    expect(focused(1)).toBe(locked)
    await pressKey(2, 'Home')
    await pressKey(2, 'ArrowDown')
    expect(focused(2)).toBe('8')
    expect(grid(2).querySelector('[data-selected]')).toBeNull()
  })

  it('selects the focused day with Enter and ignores that key when disabled or read-only', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <>
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} disabled />
          <Calendar mode="single" defaultMonth={new Date(2026, 10, 1)} showOutsideDays={false} readOnly />
        </>
      )
    )
    mounted.push({ root, host })
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const focused = (index: number) => grid(index).querySelector('[data-focus]')?.textContent?.trim() ?? ''
    const pressKey = async (index: number, key: string) => {
      await act(async () => {
        grid(index).querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    }
    await pressKey(0, 'Home')
    await pressKey(0, 'Enter')
    expect(focused(0)).toBe('1')
    expect(grid(0).querySelector('[data-selected]')?.textContent?.trim()).toBe('1')
    await pressKey(1, 'Home')
    await pressKey(1, 'Enter')
    expect(grid(1).querySelector('[data-selected]')).toBeNull()
    await pressKey(2, 'Home')
    await pressKey(2, 'Enter')
    expect(focused(2)).toBe('1')
    expect(grid(2).querySelector('[data-selected]')).toBeNull()
  })
})
