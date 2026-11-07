// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
  type DateRangePickerValue,
} from './date-range-picker'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('date range picker value', () => {
  it('follows a later range and clears it', async () => {
    function Harness() {
      const [value, setValue] = useState<DateRangePickerValue>({
        from: new Date(2026, 10, 1),
        to: new Date(2026, 10, 7),
      })
      return (
        <>
          <button
            type="button"
            onClick={() => setValue({ from: new Date(2026, 10, 8), to: new Date(2026, 10, 9) })}
          >
            Next
          </button>
          <button type="button" onClick={() => setValue(null)}>
            Clear
          </button>
          <DateRangePicker value={value}>
            <DateRangePickerTrigger />
          </DateRangePicker>
        </>
      )
    }
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => root.render(<Harness />))
    mounted.push({ root, host })
    const label = () => document.querySelector('[data-slot="date-range-picker-trigger"]')?.textContent ?? ''
    expect(label()).toMatch(/01/)
    expect(label()).toMatch(/07/)
    const press = (name: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === name)
    await act(async () => {
      press('Next')?.click()
    })
    expect(label()).toMatch(/08/)
    expect(label()).toMatch(/09/)
    await act(async () => {
      press('Clear')?.click()
    })
    expect(label()).toBe('Date')
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DateRangePicker open={null} defaultOpen onOpenChange={(open) => seen.push(open)}>
          <DateRangePickerTrigger />
          <DateRangePickerContent>Range</DateRangePickerContent>
        </DateRangePicker>
      )
    )
    mounted.push({ root, host })
    const trigger = document.querySelector('[data-slot="date-range-picker-trigger"]') as HTMLButtonElement
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeNull()
    await act(async () => {
      trigger.click()
    })
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeNull()
    expect(seen).toEqual([true])
  })

  it('returns focus to the trigger when Escape closes it', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() =>
      root.render(
        <DateRangePicker>
          <DateRangePickerTrigger />
          <DateRangePickerContent>Range</DateRangePickerContent>
        </DateRangePicker>
      )
    )
    mounted.push({ root, host })
    const trigger = document.querySelector('[data-slot="date-range-picker-trigger"]') as HTMLButtonElement
    await act(async () => {
      trigger.click()
    })
    const content = document.querySelector('[data-slot="date-range-picker-content"]')
    expect(content).not.toBeNull()
    await act(async () => {
      content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })
})
