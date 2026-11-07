import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Calendar from './calendar.vue'

const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = async (mode: 'single' | 'multiple' | 'range', disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () => h(Calendar, { mode, disabled, showOutsideDays: false }),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const days = () =>
  [...document.querySelectorAll('[data-slot="calendar"] td')].filter(
    (cell) => !cell.hasAttribute('data-outside')
  )

const press = async (index: number) => {
  days()[index]?.querySelector('button')?.click()
  await nextTick()
}

const selected = () => document.querySelectorAll('[data-slot="calendar"] td[data-selected]').length

const selectedLabel = () =>
  document.querySelector('[data-slot="calendar"] td[data-selected] button')?.textContent?.trim()

describe('vue calendar mode', () => {
  it('marks today with aria-current date', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 7, 12))
    try {
      await show('single')
      const today = document.querySelector('[data-slot="calendar"] button[aria-current="date"]')
      expect(today?.textContent?.trim()).toBe('7')
      expect(document.querySelectorAll('[data-slot="calendar"] button[aria-current="date"]')).toHaveLength(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('follows a later selected date', async () => {
    const selected = ref<Date | null>(new Date(2026, 10, 1))
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
                    selected.value = new Date(2026, 10, 7)
                  },
                },
                'Next'
              ),
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    selected.value = null
                  },
                },
                'Clear'
              ),
              h(Calendar, { mode: 'single', selected: selected.value, showOutsideDays: false }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(selectedLabel()).toBe('1')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2026-11-01')
    document.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(selectedLabel()).toBe('7')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('2026-11-07')
    const clear = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    clear?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.querySelectorAll('[data-slot="calendar"] td[data-selected]').length).toBe(0)
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('keeps one day when mode is single', async () => {
    await show('single')
    await press(0)
    await press(1)
    expect(selected()).toBe(1)
  })

  it('keeps every pressed day when mode is multiple', async () => {
    await show('multiple')
    await press(0)
    await press(1)
    expect(selected()).toBe(2)
  })

  it('keeps a start and an end when mode is range', async () => {
    await show('range')
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
    const app = createApp({
      render: () => h(Calendar, { mode: 'single', disabled: first, showOutsideDays: false }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await press(0)
    expect(selected()).toBe(0)
    expect(days()[0]?.querySelector('button')?.hasAttribute('disabled')).toBe(true)
    await press(1)
    expect(selected()).toBe(1)
  })

  it('ignores presses while disabled', async () => {
    await show('single', true)
    await press(0)
    expect(selected()).toBe(0)
  })

  it('ignores a day press while read-only', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Calendar, { mode: 'single', readOnly: true, showOutsideDays: false }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const button = days()[0]?.querySelector('button')
    expect(button?.hasAttribute('disabled')).toBe(false)
    await press(0)
    expect(selected()).toBe(0)
  })

  it('stops at the end month and does not move before the start month', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Calendar, {
          mode: 'single',
          defaultMonth: new Date(2026, 10, 1),
          startMonth: new Date(2026, 10, 1),
          endMonth: new Date(2026, 11, 1),
          showOutsideDays: false,
        }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const text = () => host.querySelector('[data-slot="calendar"]')?.textContent ?? ''
    expect(host.querySelector('[data-slot="calendar"] table')?.getAttribute('aria-label')).toContain('November')
    const button = (pattern: RegExp) =>
      [...host.querySelectorAll('button')].find((item) => pattern.test(item.getAttribute('aria-label') ?? '')) as
        | HTMLButtonElement
        | undefined
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

  it('moves to the first and last day of the visible month with Home and End without selecting them', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, disabled: true }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, readOnly: true }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const focused = (index: number) => grid(index).querySelector('[data-focus]')?.textContent?.trim() ?? ''
    const pressKey = async (index: number, key: string) => {
      grid(index).querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
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
    const app = createApp({
      render: () =>
        h('div', [
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, disabled: true }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, readOnly: true }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const label = (index: number) => grid(index).querySelector('table')?.getAttribute('aria-label') ?? ''
    const pressKey = async (index: number, key: string) => {
      grid(index).querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
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
    const app = createApp({
      render: () =>
        h('div', [
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, disabled: true }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, readOnly: true }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const label = (index: number) => grid(index).querySelector('table')?.getAttribute('aria-label') ?? ''
    const pressKey = async (index: number, key: string, shiftKey = false) => {
      grid(index).querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
      await nextTick()
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
    const app = createApp({
      render: () =>
        h('div', [
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, disabled: true }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, readOnly: true }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const focused = (index: number) => grid(index).querySelector('[data-focus]')?.textContent?.trim() ?? ''
    const pressKey = async (index: number, key: string) => {
      grid(index).querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
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
    const app = createApp({
      render: () =>
        h('div', [
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, disabled: true }),
          h(Calendar, { mode: 'single', defaultMonth: new Date(2026, 10, 1), showOutsideDays: false, readOnly: true }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const grid = (index: number) => document.querySelectorAll('[data-slot="calendar"]')[index]
    const focused = (index: number) => grid(index).querySelector('[data-focus]')?.textContent?.trim() ?? ''
    const pressKey = async (index: number, key: string) => {
      grid(index).querySelector('table')?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
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
