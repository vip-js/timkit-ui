import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import NumberField from './number-field.vue'
import NumberFieldDecrement from './number-field-decrement.vue'
import NumberFieldIncrement from './number-field-increment.vue'
import NumberFieldInput from './number-field-input.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (props: Record<string, unknown> = {}) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(NumberField, { defaultValue: 1, spinOnPress: false, ...props }, () => [
        h(NumberFieldDecrement, () => '-'),
        h(NumberFieldInput),
        h(NumberFieldIncrement, () => '+'),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
}

const press = (selector: string) => {
  const node = document.querySelector(selector) as HTMLElement | null
  if (!node) throw new Error(`missing ${selector}`)
  node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }))
  node.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }))
}

describe('vue number field value', () => {
  it('follows a later value and ignores a disabled step', async () => {
    const value = ref(1)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = 4) }, 'Four'),
              h('button', { type: 'button', onClick: () => (value.value = 0) }, 'Zero'),
              h(NumberField, { modelValue: value.value, spinOnPress: false, disabled: true }, () => [
                h(NumberFieldDecrement, () => '-'),
                h(NumberFieldInput),
                h(NumberFieldIncrement, () => '+'),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = () => document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    expect(input().getAttribute('aria-label')).toBe('Number')
    expect(input().value).toBe('1')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('1')
    press('[data-slot="number-field-increment"]')
    await nextTick()
    expect(input().value).toBe('1')
    const button = (label: string) =>
      [...host.querySelectorAll('button')].find((node) => node.textContent === label)
    button('Four')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(input().value).toBe('4')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('4')
    button('Zero')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(input().value).toBe('0')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('0')
  })

  it('steps the value and ignores a disabled field', async () => {
    show()
    await nextTick()
    const input = () => document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    expect(input().value).toBe('1')
    press('[data-slot="number-field-increment"]')
    await nextTick()
    expect(input().value).toBe('2')
    press('[data-slot="number-field-decrement"]')
    await nextTick()
    expect(input().value).toBe('1')

    document.body.innerHTML = ''
    show({ disabled: true })
    await nextTick()
    const disabledInput = document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    const increment = document.querySelector('[data-slot="number-field-increment"]') as HTMLButtonElement
    expect(disabledInput.disabled).toBe(true)
    expect(increment.disabled).toBe(true)
    press('[data-slot="number-field-increment"]')
    await nextTick()
    expect(disabledInput.value).toBe('1')
  })

  it('steps from the input with ArrowUp and ArrowDown', async () => {
    show()
    await nextTick()
    const input = () => document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    const key = async (name: string) => {
      input().focus()
      input().dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }))
      await nextTick()
    }
    await key('ArrowUp')
    expect(input().value).toBe('2')
    await key('ArrowDown')
    expect(input().value).toBe('1')
    show({ readOnly: true })
    await nextTick()
    const locked = document.querySelectorAll('[data-slot="number-field-input"]')[1] as HTMLInputElement
    locked.focus()
    locked.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    await nextTick()
    expect(locked.value).toBe('1')
  })

  it('moves by ten steps with PageUp, PageDown, and Shift plus an arrow', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(NumberField, { defaultValue: 20, spinOnPress: false }, () => h(NumberFieldInput)),
          h(NumberField, { defaultValue: 95, max: 100, spinOnPress: false }, () => h(NumberFieldInput)),
          h(NumberField, { defaultValue: 20, disabled: true, spinOnPress: false }, () => h(NumberFieldInput)),
          h(NumberField, { defaultValue: 20, readOnly: true, spinOnPress: false }, () => h(NumberFieldInput)),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const inputs = () => host.querySelectorAll('[data-slot="number-field-input"]')
    const key = async (index: number, name: string, shiftKey = false) => {
      const input = inputs()[index] as HTMLInputElement
      input.focus()
      input.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, shiftKey }))
      await nextTick()
    }
    await key(0, 'PageUp')
    expect((inputs()[0] as HTMLInputElement).value).toBe('30')
    await key(0, 'PageDown')
    expect((inputs()[0] as HTMLInputElement).value).toBe('20')
    await key(0, 'ArrowUp', true)
    expect((inputs()[0] as HTMLInputElement).value).toBe('30')
    await key(1, 'PageUp')
    expect((inputs()[1] as HTMLInputElement).value).toBe('100')
    await key(2, 'PageUp')
    expect((inputs()[2] as HTMLInputElement).value).toBe('20')
    await key(3, 'PageDown')
    expect((inputs()[3] as HTMLInputElement).value).toBe('20')
  })

  it('jumps to the minimum with Home and the maximum with End', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(NumberField, { defaultValue: 20, min: 0, max: 100, spinOnPress: false }, () => h(NumberFieldInput)),
          h(NumberField, { defaultValue: 20, min: 0, max: 100, disabled: true, spinOnPress: false }, () => h(NumberFieldInput)),
          h(NumberField, { defaultValue: 20, min: 0, max: 100, readOnly: true, spinOnPress: false }, () => h(NumberFieldInput)),
          h(NumberField, { defaultValue: 20, spinOnPress: false }, () => h(NumberFieldInput)),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const inputs = () => host.querySelectorAll('[data-slot="number-field-input"]')
    const key = async (index: number, name: string) => {
      const input = inputs()[index] as HTMLInputElement
      input.focus()
      input.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }))
      await nextTick()
    }
    await key(0, 'Home')
    expect((inputs()[0] as HTMLInputElement).value).toBe('0')
    await key(0, 'End')
    expect((inputs()[0] as HTMLInputElement).value).toBe('100')
    await key(1, 'Home')
    expect((inputs()[1] as HTMLInputElement).value).toBe('20')
    await key(2, 'End')
    expect((inputs()[2] as HTMLInputElement).value).toBe('20')
    await key(3, 'Home')
    expect((inputs()[3] as HTMLInputElement).value).toBe('-9007199254740991')
    await key(3, 'End')
    expect((inputs()[3] as HTMLInputElement).value).toBe('9007199254740991')
  })

  it('keeps a read-only field focusable and ignores steps', async () => {
    show({ readOnly: true })
    await nextTick()
    const input = document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    const increment = document.querySelector('[data-slot="number-field-increment"]') as HTMLButtonElement
    const decrement = document.querySelector('[data-slot="number-field-decrement"]') as HTMLButtonElement
    expect(input.readOnly).toBe(true)
    expect(input.disabled).toBe(false)
    expect(increment.disabled).toBe(true)
    expect(decrement.disabled).toBe(true)
    press('[data-slot="number-field-increment"]')
    await nextTick()
    expect(input.value).toBe('1')
  })

  it('stays empty when the model is null even if the default is 1', async () => {
    const seen: Array<number | undefined> = []
    show({
      modelValue: null,
      defaultValue: 1,
      onChange: (value?: number) => seen.push(value),
    })
    await nextTick()
    const input = () => document.querySelector('[data-slot="number-field-input"]') as HTMLInputElement
    expect(input().value).toBe('')
    press('[data-slot="number-field-increment"]')
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(input().value).toBe('')
    expect(seen.length).toBeGreaterThan(0)
  })

  it('keeps the value inside a later min and max', async () => {
    const max = ref(100)
    const min = ref<number | undefined>(undefined)
    const host = document.createElement('div')
    document.body.append(host)
    const Harness = defineComponent({
      setup() {
        return () =>
          h('div', [
            h('button', { type: 'button', onClick: () => (max.value = 40) }, 'Cap'),
            h('button', { type: 'button', onClick: () => (min.value = 30) }, 'Floor'),
            h(NumberField, { defaultValue: 80, max: max.value, spinOnPress: false }, () => h(NumberFieldInput)),
            h(NumberField, { defaultValue: 10, min: min.value, spinOnPress: false }, () => h(NumberFieldInput)),
          ])
      },
    })
    const app = createApp(Harness)
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const inputs = () => host.querySelectorAll('input')
    const click = async (label: string) => {
      ;[...host.querySelectorAll('button')].find((button) => button.textContent === label)?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
      await nextTick()
    }
    expect(inputs()[0]?.value).toBe('80')
    await click('Cap')
    expect(inputs()[0]?.value).toBe('40')
    expect(inputs()[1]?.value).toBe('10')
    await click('Floor')
    expect(inputs()[1]?.value).toBe('30')
  })
})
