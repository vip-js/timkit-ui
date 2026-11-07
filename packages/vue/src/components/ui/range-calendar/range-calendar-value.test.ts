import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import DateRangePicker from '../date-range-picker/date-range-picker.vue'
import DateRangePickerContent from '../date-range-picker/date-range-picker-content.vue'
import DateRangePickerTrigger from '../date-range-picker/date-range-picker-trigger.vue'
import RangeCalendar from './range-calendar.vue'

globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const days = () =>
  [...document.querySelectorAll('[data-slot="calendar"] button[data-view="day"]')].filter(
    (button) => !button.hasAttribute('data-outside-range') && !(button as HTMLButtonElement).disabled
  )

describe('vue range calendar value', () => {
  it('stays open after the start date and closes when the range is complete', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DateRangePicker, { defaultOpen: true }, () => [
          h(DateRangePickerTrigger),
          h(DateRangePickerContent, () => h(RangeCalendar)),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeTruthy()
    days()[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeTruthy()
    days()[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeNull()
  })
})
