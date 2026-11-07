import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import DateRangePicker from './date-range-picker.vue'
import DateRangePickerContent from './date-range-picker-content.vue'
import DateRangePickerTrigger from './date-range-picker-trigger.vue'

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

describe('vue date range picker value', () => {
  it('follows a later range and clears it', async () => {
    const value = ref<{ from?: Date; to?: Date } | null>({
      from: new Date(2026, 10, 1),
      to: new Date(2026, 10, 7),
    })
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    value.value = { from: new Date(2026, 10, 8), to: new Date(2026, 10, 9) }
                  },
                },
                'Next'
              ),
              h('button', { type: 'button', onClick: () => (value.value = null) }, 'Clear'),
              h(DateRangePicker, { mode: 'range', value: value.value }, () => h(DateRangePickerTrigger)),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const label = () => document.querySelector('[data-slot="date-range-picker-trigger"]')?.textContent ?? ''
    expect(label()).toMatch(/01/)
    expect(label()).toMatch(/07/)
    const press = (name: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === name)
    press('Next')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(label()).toMatch(/08/)
    expect(label()).toMatch(/09/)
    press('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(label()).toBe('Date')
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          DateRangePicker,
          { open: null, defaultOpen: true, onOpenChange: (open: boolean) => seen.push(open) },
          () => [h(DateRangePickerTrigger), h(DateRangePickerContent, () => 'Range')]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="date-range-picker-trigger"]') as HTMLButtonElement
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeNull()
    trigger.click()
    await nextTick()
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeNull()
    expect(seen).toEqual([true])
  })

  it('returns focus to the trigger when Escape closes it', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(DateRangePicker, () => [h(DateRangePickerTrigger), h(DateRangePickerContent, () => 'Range')]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="date-range-picker-trigger"]') as HTMLButtonElement
    trigger.click()
    await nextTick()
    const content = document.querySelector('[data-slot="date-range-picker-content"]')
    expect(content).not.toBeNull()
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(trigger)
    await nextTick()
    expect(document.querySelector('[data-slot="date-range-picker-content"]')).toBeNull()
  })
})
