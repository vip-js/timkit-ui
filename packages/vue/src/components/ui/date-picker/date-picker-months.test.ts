import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import DatePicker from './date-picker.vue'

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

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const monthCount = async (months: number) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () => h(DatePicker, { defaultOpen: true, numberOfMonths: months }),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
  return document.querySelectorAll('[data-slot="calendar"] table').length
}

const days = () =>
  [...document.querySelectorAll('[data-slot="calendar"] button[data-view="day"]')].filter(
    (button) => !button.hasAttribute('data-outside-range') && !(button as HTMLButtonElement).disabled
  )

describe('vue date picker months', () => {
  it('follows a later value', async () => {
    const value = ref<Date | null>(new Date(2026, 10, 1))
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
                    value.value = new Date(2026, 10, 7)
                  },
                },
                'Next'
              ),
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    value.value = null
                  },
                },
                'Clear'
              ),
              h(DatePicker, { value: value.value }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const label = () => document.querySelector('[data-slot="date-picker"]')?.textContent ?? ''
    expect(label()).toMatch(/01/)
    expect(label()).toMatch(/2026/)
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2026-11-01')
    document.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(label()).toMatch(/07/)
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2026-11-07')
    const clear = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    clear?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(label()).toContain('Date')
    expect(label()).not.toMatch(/07/)
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('shows one month by default', async () => {
    expect(await monthCount(1)).toBe(1)
  })

  it('shows every month requested by numberOfMonths', async () => {
    expect(await monthCount(2)).toBe(2)
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DatePicker, { open: null, defaultOpen: true, onOpenChange: (open: boolean) => seen.push(open) }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="date-picker"] button') as HTMLButtonElement
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeNull()
    trigger.click()
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeNull()
    expect(seen).toEqual([true])
  })

  it('opens while read-only and ignores a day press', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(DatePicker, { defaultOpen: true, readOnly: true }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const day = document.querySelector(
      '[data-slot="calendar"] td button:not([disabled])'
    ) as HTMLButtonElement
    expect(day).toBeTruthy()
    expect(day.hasAttribute('disabled')).toBe(false)
    day.click()
    await nextTick()
    expect(document.querySelectorAll('[data-slot="calendar"] button[data-selected]').length).toBe(0)
    expect(document.querySelector('[data-slot="date-picker"]')?.textContent).toContain('Date')
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeTruthy()
  })

  it('keeps a start and an end when mode is range', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(DatePicker, { mode: 'range', defaultOpen: true }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const label = () => host.querySelector('[data-slot="date-picker"] button')?.textContent ?? ''
    days()[0]?.click()
    await nextTick()
    days()[2]?.click()
    await nextTick()
    expect(label()).toContain(' - ')
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeTruthy()
    days()[4]?.click()
    await nextTick()
    expect(label()).not.toContain(' - ')
  })

  it('stops at the end month and does not move before the start month', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DatePicker, {
          defaultOpen: true,
          calendarProps: {
            defaultMonth: new Date(2026, 10, 1),
            startMonth: new Date(2026, 10, 1),
            endMonth: new Date(2026, 11, 1),
            showOutsideDays: false,
          },
        }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const text = () => document.querySelector('[data-slot="calendar"]')?.textContent ?? ''
    const button = (pattern: RegExp) =>
      [...document.querySelectorAll('[data-slot="calendar"] button')].find((item) =>
        pattern.test(item.getAttribute('aria-label') ?? '')
      ) as HTMLButtonElement | undefined
    expect(text()).toContain('November')
    expect(button(/prev/i)?.disabled).toBe(true)
    button(/prev/i)?.click()
    await nextTick()
    expect(text()).toContain('November')
    button(/next/i)?.click()
    await nextTick()
    expect(text()).toContain('December')
    expect(button(/next/i)?.disabled).toBe(true)
    button(/next/i)?.click()
    await nextTick()
    expect(text()).toContain('December')
  })

  it('announces a required trigger and closes on Escape', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(DatePicker, { required: true, placeholder: 'Need a date' }),
          h(DatePicker, { placeholder: 'Optional' }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const triggers = host.querySelectorAll('[data-slot="date-picker"] button')
    expect(triggers[0]?.getAttribute('aria-haspopup')).toBe('grid')
    expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false')
    expect(triggers[0]?.getAttribute('aria-required')).toBe('true')
    expect(triggers[0]?.getAttribute('aria-label')).toBe('Open calendar')
    expect(triggers[1]?.getAttribute('aria-required')).toBeNull()
    ;(triggers[0] as HTMLButtonElement).click()
    await nextTick()
    expect(triggers[0]?.getAttribute('aria-expanded')).toBe('true')
    expect(triggers[0]?.getAttribute('aria-label')).toBe('Close calendar')
    const content = document.querySelector('[data-slot="date-picker-content"]')
    expect(triggers[0]?.getAttribute('aria-controls')).toBe(content?.id)
    expect(content?.getAttribute('role')).toBe('application')
    document.querySelector('[data-slot="date-picker-content"]')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    )
    await nextTick()
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeNull()
    expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false')
    expect(triggers[0]?.getAttribute('aria-label')).toBe('Open calendar')
    expect(document.activeElement).toBe(triggers[0])
  })

  it('selects the focused day with Enter and keeps the calendar open', async () => {
    const open = async (extra: Record<string, unknown> = {}) => {
      const host = document.createElement('div')
      document.body.append(host)
      const app = createApp({
        render: () =>
          h(DatePicker, {
            defaultOpen: true,
            calendarProps: { defaultMonth: new Date(2026, 10, 1), showOutsideDays: false },
            ...extra,
          }),
      })
      app.mount(host)
      mounted.push({ unmount: () => app.unmount(), host })
      await nextTick()
      return host
    }
    const grid = () => document.querySelector('[data-slot="calendar"]')
    const focused = () => grid()?.querySelector('[data-focus]')?.textContent?.trim() ?? ''
    const pressKey = async (key: string) => {
      grid()?.querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    const close = () => {
      const last = mounted.pop()
      last?.unmount()
      last?.host.remove()
    }
    const plain = await open()
    await pressKey('Home')
    await pressKey('Enter')
    expect(focused()).toBe('1')
    expect(grid()?.querySelector('[data-selected]')?.textContent?.trim()).toBe('1')
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeTruthy()
    expect(plain.textContent).toMatch(/01/)
    close()

    const lockedHost = await open({ disabled: true })
    const locked = focused()
    await pressKey('Home')
    await pressKey('Enter')
    expect(focused()).toBe(locked)
    expect(grid()?.querySelector('[data-selected]')).toBeNull()
    expect(lockedHost.textContent).toContain('Date')
    close()

    const frozen = await open({ readOnly: true })
    await pressKey('Home')
    await pressKey('ArrowDown')
    expect(focused()).toBe('8')
    await pressKey('Enter')
    expect(grid()?.querySelector('[data-selected]')).toBeNull()
    expect(frozen.textContent).toContain('Date')
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeTruthy()
  })

  it('moves the open calendar by a year with Shift and PageUp or PageDown without selecting a day', async () => {
    const open = async (extra: Record<string, unknown> = {}) => {
      const host = document.createElement('div')
      document.body.append(host)
      const app = createApp({
        render: () =>
          h(DatePicker, {
            defaultOpen: true,
            calendarProps: { defaultMonth: new Date(2026, 10, 1), showOutsideDays: false },
            ...extra,
          }),
      })
      app.mount(host)
      mounted.push({ unmount: () => app.unmount(), host })
      await nextTick()
      return host
    }
    const label = () => document.querySelector('[data-slot="calendar"] table')?.getAttribute('aria-label') ?? ''
    const pressKey = async (key: string, shiftKey = false) => {
      document
        .querySelector('[data-slot="calendar"] table')
        ?.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
      await nextTick()
    }
    const close = () => {
      const last = mounted.pop()
      last?.unmount()
      last?.host.remove()
    }
    await open()
    expect(label()).toContain('November 2026')
    await pressKey('PageDown', true)
    expect(label()).toContain('November 2027')
    expect(document.querySelector('[data-selected]')).toBeNull()
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeTruthy()
    await pressKey('PageUp', true)
    expect(label()).toContain('November 2026')
    close()

    await open({ disabled: true })
    const locked = label()
    await pressKey('PageDown', true)
    expect(label()).toBe(locked)
    close()

    await open({ readOnly: true })
    await pressKey('PageDown', true)
    expect(label()).toContain('November 2027')
    expect(document.querySelector('[data-selected]')).toBeNull()
    expect(document.querySelector('[data-slot="date-picker-content"]')).toBeTruthy()
  })
})
