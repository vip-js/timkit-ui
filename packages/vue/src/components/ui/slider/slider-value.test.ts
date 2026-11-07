import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Slider from './slider.vue'

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

const press = async (thumb: Element, key: string, shiftKey = false) => {
  const node = thumb as HTMLElement
  node.focus()
  node.dispatchEvent(new FocusEvent('focus', { bubbles: true }))
  node.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, shiftKey }))
  await nextTick()
}

describe('vue slider value', () => {
  it('follows a later value and keeps a disabled thumb still', async () => {
    const value = ref([10])
    const locked = ref([10])
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = [70]) }, 'Jump'),
              h('button', { type: 'button', onClick: () => (locked.value = [40]) }, 'Lock'),
              h(Slider, { value: value.value }),
              h(Slider, { disabled: true, value: locked.value }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const thumbs = () => host.querySelectorAll('[data-slot="slider-thumb"]')
    expect(thumbs()[0]?.getAttribute('aria-label')).toBe('Value')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('10')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('10')
    await press(thumbs()[1] as Element, 'ArrowRight')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('10')
    const click = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    click('Jump')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('Lock')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('70')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('40')
  })

  it('moves with the arrow keys and stays put while disabled', async () => {
    const seen: number[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Slider, { defaultValue: [20], onChange: (value: number[]) => seen.push(value) }),
        h(Slider, { disabled: true, defaultValue: [20] }),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const thumbs = document.querySelectorAll('[data-slot="slider-thumb"]')
    expect(thumbs[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs[0] as Element, 'ArrowRight')
    expect(thumbs[0]?.getAttribute('aria-valuenow')).toBe('21')
    expect(host.querySelector('[data-slot="slider-value"]')?.textContent).toBe('21')
    await press(thumbs[0] as Element, 'ArrowLeft')
    expect(thumbs[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs[1] as Element, 'ArrowRight')
    expect(thumbs[1]?.getAttribute('aria-valuenow')).toBe('20')
    expect(seen).toEqual([[21], [20]])
  })

  it('reads both thumbs', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({ render: () => h(Slider, { defaultValue: [20, 40] }) })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="slider-value"]')?.textContent).toBe('20 to 40')
  })

  it('clears when the model is set to null and stays there', async () => {
    const value = ref<number[] | null>([10])
    const seen: number[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = null) }, 'Clear'),
              h(Slider, {
                modelValue: value.value,
                onChange: (next: number[]) => seen.push(next),
              }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const thumb = () => host.querySelector('[data-slot="slider-thumb"]')
    expect(thumb()?.getAttribute('aria-valuenow')).toBe('10')
    ;[...host.querySelectorAll('button')].find((button) => button.textContent === 'Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    const shown = thumb()?.getAttribute('aria-valuenow')
    expect(shown == null || shown === '').toBe(true)
    if (thumb()) await press(thumb() as Element, 'ArrowRight')
    expect(thumb()?.getAttribute('aria-valuenow') == null || thumb()?.getAttribute('aria-valuenow') === '').toBe(true)
  })

  it('moves with Up when the slider is vertical and ignores Right', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Slider, { defaultValue: [20] }),
          h(Slider, { orientation: 'vertical', defaultValue: [20] }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const thumbs = () => host.querySelectorAll('[data-slot="slider-thumb"]')
    expect(thumbs()[0]?.getAttribute('aria-orientation')).toBe('horizontal')
    await press(thumbs()[0] as Element, 'ArrowUp')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[0] as Element, 'ArrowRight')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('21')
    expect(thumbs()[1]?.getAttribute('aria-orientation')).toBe('vertical')
    await press(thumbs()[1] as Element, 'ArrowRight')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[1] as Element, 'ArrowUp')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('21')
  })

  it('keeps the value inside a later min and max', async () => {
    const max = ref(100)
    const min = ref(0)
    const host = document.createElement('div')
    document.body.append(host)
    const Harness = defineComponent({
      setup() {
        return () =>
          h('div', [
            h('button', { type: 'button', onClick: () => (max.value = 40) }, 'Cap'),
            h('button', { type: 'button', onClick: () => (min.value = 30) }, 'Floor'),
            h(Slider, { defaultValue: [80], max: max.value }),
            h(Slider, { defaultValue: [10], min: min.value }),
          ])
      },
    })
    const app = createApp(Harness)
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const thumbs = () => host.querySelectorAll('[data-slot="slider-thumb"]')
    const click = async (label: string) => {
      ;[...host.querySelectorAll('button')].find((button) => button.textContent === label)?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
      await nextTick()
    }
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('80')
    await click('Cap')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('40')
    expect(thumbs()[0]?.getAttribute('aria-valuemax')).toBe('40')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('10')
    await click('Floor')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('30')
    expect(thumbs()[1]?.getAttribute('aria-valuemin')).toBe('30')
  })

  it('jumps to the minimum with Home and the maximum with End', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Slider, { defaultValue: [20] }),
          h(Slider, { disabled: true, defaultValue: [20] }),
          h(Slider, { readOnly: true, defaultValue: [20] }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const thumbs = () => host.querySelectorAll('[data-slot="slider-thumb"]')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[0] as Element, 'Home')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('0')
    await press(thumbs()[0] as Element, 'End')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('100')
    await press(thumbs()[1] as Element, 'Home')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[2] as Element, 'End')
    expect(thumbs()[2]?.getAttribute('aria-valuenow')).toBe('20')
  })

  it('moves by ten steps with PageUp and PageDown', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Slider, { defaultValue: [20] }),
          h(Slider, { orientation: 'vertical', defaultValue: [20] }),
          h(Slider, { defaultValue: [95] }),
          h(Slider, { disabled: true, defaultValue: [20] }),
          h(Slider, { readOnly: true, defaultValue: [20] }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const thumbs = () => host.querySelectorAll('[data-slot="slider-thumb"]')
    await press(thumbs()[0] as Element, 'PageUp')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[0] as Element, 'PageDown')
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[1] as Element, 'PageUp')
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[2] as Element, 'PageUp')
    expect(thumbs()[2]?.getAttribute('aria-valuenow')).toBe('100')
    await press(thumbs()[3] as Element, 'PageUp')
    expect(thumbs()[3]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[4] as Element, 'PageDown')
    expect(thumbs()[4]?.getAttribute('aria-valuenow')).toBe('20')
  })

  it('moves by ten steps when Shift is held with an arrow', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Slider, { defaultValue: [20] }),
          h(Slider, { orientation: 'vertical', defaultValue: [20] }),
          h(Slider, { defaultValue: [95] }),
          h(Slider, { disabled: true, defaultValue: [20] }),
          h(Slider, { readOnly: true, defaultValue: [20] }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const thumbs = () => host.querySelectorAll('[data-slot="slider-thumb"]')
    await press(thumbs()[0] as Element, 'ArrowRight', true)
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[0] as Element, 'ArrowUp', true)
    expect(thumbs()[0]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[1] as Element, 'ArrowUp', true)
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[1] as Element, 'ArrowRight', true)
    expect(thumbs()[1]?.getAttribute('aria-valuenow')).toBe('30')
    await press(thumbs()[2] as Element, 'ArrowRight', true)
    expect(thumbs()[2]?.getAttribute('aria-valuenow')).toBe('100')
    await press(thumbs()[3] as Element, 'ArrowRight', true)
    expect(thumbs()[3]?.getAttribute('aria-valuenow')).toBe('20')
    await press(thumbs()[4] as Element, 'ArrowLeft', true)
    expect(thumbs()[4]?.getAttribute('aria-valuenow')).toBe('20')
  })
})
