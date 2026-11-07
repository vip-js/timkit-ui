// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import {
  DateRangePicker,
  DateRangePickerContent,
  DateRangePickerTrigger,
} from './date-range-picker'
import { RangeCalendar } from './range-calendar'

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

const days = () =>
  [...document.querySelectorAll('[data-slot="calendar"] button[data-view="day"]')].filter(
    (button) => !button.hasAttribute('data-outside-range') && !(button as HTMLButtonElement).disabled
  )

describe('range calendar value', () => {
  it('stays open after the start date and closes when the range is complete', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    act(() => {
      root.render(
        <DateRangePicker defaultOpen>
          <DateRangePickerTrigger />
          <DateRangePickerContent>
            <RangeCalendar />
          </DateRangePickerContent>
        </DateRangePicker>
      )
    })
    mounted.push({ root, host })
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeTruthy()
    await act(async () => {
      days()[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeTruthy()
    await act(async () => {
      days()[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeNull()
  })
})
