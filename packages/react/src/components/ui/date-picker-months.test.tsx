// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { DatePicker } from './date-picker'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const monthCount = (months: number) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(<DatePicker defaultOpen numberOfMonths={months} />))
  mounted.push({ root, host })
  return document.querySelectorAll('[data-slot="calendar"] table').length
}

const days = () =>
  [...document.querySelectorAll('[data-slot="calendar"] button[data-view="day"]')].filter(
    (button) => !button.hasAttribute('data-outside-range')
  )

const pressDay = async (index: number) => {
  await act(async () => {
    days()[index]?.click()
  })
}

describe('date picker months', () => {
  it('follows a later value', async () => {
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
          <DatePicker value={day} />
        </>
      )
    }
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<Harness />))
    mounted.push({ root, host })
    const label = () => document.querySelector('[data-slot="date-picker"]')?.textContent ?? ''
    expect(label()).toMatch(/01/)
    expect(label()).toMatch(/2026/)
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2026-11-01')
    const next = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Next')
    await act(async () => {
      next?.click()
    })
    expect(label()).toMatch(/07/)
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2026-11-07')
    const clear = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    await act(async () => {
      clear?.click()
    })
    expect(label()).toContain('Date')
    expect(label()).not.toMatch(/07/)
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  it('shows one month by default', () => {
    expect(monthCount(1)).toBe(1)
  })

  it('shows every month requested by numberOfMonths', () => {
    expect(monthCount(2)).toBe(2)
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DatePicker open={null} defaultOpen onOpenChange={(open) => seen.push(open)} />
      )
    )
    mounted.push({ root, host })
    const trigger = document.querySelector('[data-slot="date-picker"] button') as HTMLButtonElement
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeNull()
    await act(async () => {
      trigger.click()
    })
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeNull()
    expect(seen).toEqual([true])
  })

  it('opens while read-only and ignores a day press', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<DatePicker defaultOpen readOnly />))
    mounted.push({ root, host })
    const day = document.querySelector(
      '[data-slot="calendar"] td button:not([disabled])'
    ) as HTMLButtonElement
    expect(day).toBeTruthy()
    expect(day.disabled).toBe(false)
    await act(async () => {
      day.click()
    })
    expect(document.querySelectorAll('[data-slot="calendar"] button[data-selected]').length).toBe(0)
    expect(document.querySelector('[data-slot="date-picker"]')?.textContent).toContain('Date')
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeTruthy()
  })

  it('keeps a start and an end when mode is range', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<DatePicker mode="range" defaultOpen />))
    mounted.push({ root, host })
    const label = () => document.querySelector('[data-slot="date-picker"] button')?.textContent ?? ''
    await pressDay(0)
    await pressDay(2)
    expect(label()).toContain(' - ')
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeTruthy()
    await pressDay(4)
    expect(label()).not.toContain(' - ')
  })

  it('stops at the end month and does not move before the start month', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DatePicker
          defaultOpen
          calendarProps={{
            defaultMonth: new Date(2026, 10, 1),
            startMonth: new Date(2026, 10, 1),
            endMonth: new Date(2026, 11, 1),
            showOutsideDays: false,
          }}
        />
      )
    )
    mounted.push({ root, host })
    const text = () => document.querySelector('[data-slot="calendar"]')?.textContent ?? ''
    const button = (pattern: RegExp) =>
      [...document.querySelectorAll('[data-slot="calendar"] button')].find((item) =>
        pattern.test(item.getAttribute('aria-label') ?? '')
      ) as HTMLButtonElement | undefined
    expect(text()).toContain('November')
    expect(button(/prev/i)?.disabled).toBe(true)
    await act(async () => {
      button(/prev/i)?.click()
    })
    expect(text()).toContain('November')
    await act(async () => {
      button(/next/i)?.click()
    })
    expect(text()).toContain('December')
    expect(button(/next/i)?.disabled).toBe(true)
    await act(async () => {
      button(/next/i)?.click()
    })
    expect(text()).toContain('December')
  })

  it('announces a required trigger and closes on Escape', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <>
          <DatePicker required placeholder="Need a date" />
          <DatePicker placeholder="Optional" />
        </>
      )
    )
    mounted.push({ root, host })
    const triggers = document.querySelectorAll('[data-slot="date-picker"] button')
    expect(triggers[0]?.getAttribute('aria-haspopup')).toBe('grid')
    expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false')
    expect(triggers[0]?.getAttribute('aria-required')).toBe('true')
    expect(triggers[1]?.getAttribute('aria-required')).toBeNull()
    await act(async () => {
      ;(triggers[0] as HTMLButtonElement).click()
    })
    expect(triggers[0]?.getAttribute('aria-expanded')).toBe('true')
    const content = document.querySelector('[data-slot="date-picker-content"]')
    expect(triggers[0]?.getAttribute('aria-controls')).toBe(content?.id)
    expect(content?.getAttribute('role')).toBe('application')
    await act(async () => {
      content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeNull()
    expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(triggers[0])
  })

  it('selects the focused day with Enter and keeps the calendar open', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <>
          <DatePicker defaultOpen calendarProps={{ defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }} />
          <DatePicker
            defaultOpen
            disabled
            calendarProps={{ defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }}
          />
          <DatePicker
            defaultOpen
            readOnly
            calendarProps={{ defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }}
          />
        </>
      )
    )
    mounted.push({ root, host })
    const grids = () => document.querySelectorAll('[data-slot="calendar"]')
    const focused = (index: number) => grids()[index]?.querySelector('[data-focus]')?.textContent?.trim() ?? ''
    const pressKey = async (index: number, key: string) => {
      await act(async () => {
        grids()[index]?.querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    }
    expect(grids()).toHaveLength(3)
    await pressKey(0, 'Home')
    await pressKey(0, 'Enter')
    expect(focused(0)).toBe('1')
    expect(grids()[0]?.querySelector('[data-selected]')?.textContent?.trim()).toBe('1')
    expect(document.querySelectorAll('[data-slot="date-picker-content"]')).toHaveLength(3)
    expect(document.querySelectorAll('[data-slot="date-picker"]')[0]?.textContent).toMatch(/01/)
    const locked = focused(1)
    await pressKey(1, 'Home')
    await pressKey(1, 'Enter')
    expect(focused(1)).toBe(locked)
    expect(grids()[1]?.querySelector('[data-selected]')).toBeNull()
    await pressKey(2, 'Home')
    await pressKey(2, 'ArrowDown')
    expect(focused(2)).toBe('8')
    await pressKey(2, 'Enter')
    expect(grids()[2]?.querySelector('[data-selected]')).toBeNull()
    expect(document.querySelectorAll('[data-slot="date-picker"]')[2]?.textContent).toContain('Date')
  })

  it('moves the open calendar by a year with Shift and PageUp or PageDown without selecting a day', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <>
          <DatePicker defaultOpen calendarProps={{ defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }} />
          <DatePicker
            defaultOpen
            disabled
            calendarProps={{ defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }}
          />
          <DatePicker
            defaultOpen
            readOnly
            calendarProps={{ defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }}
          />
        </>
      )
    )
    mounted.push({ root, host })
    const grids = () => document.querySelectorAll('[data-slot="calendar"]')
    const label = (index: number) => grids()[index]?.querySelector('table')?.getAttribute('aria-label') ?? ''
    const pressKey = async (index: number, key: string, shiftKey = false) => {
      await act(async () => {
        grids()[index]
          ?.querySelector('table')
          ?.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
      })
    }
    expect(label(0)).toContain('November 2026')
    await pressKey(0, 'PageDown', true)
    expect(label(0)).toContain('November 2027')
    expect(grids()[0]?.querySelector('[data-selected]')).toBeNull()
    expect(document.querySelectorAll('[data-slot="date-picker-content"]')).toHaveLength(3)
    await pressKey(0, 'PageUp', true)
    expect(label(0)).toContain('November 2026')
    const locked = label(1)
    await pressKey(1, 'PageDown', true)
    expect(label(1)).toBe(locked)
    await pressKey(2, 'PageDown', true)
    expect(label(2)).toContain('November 2027')
    expect(grids()[2]?.querySelector('[data-selected]')).toBeNull()
  })
})
