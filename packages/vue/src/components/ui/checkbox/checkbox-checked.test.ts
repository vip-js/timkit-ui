import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Checkbox from './checkbox.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const state = (index: number) =>
  document.querySelectorAll('[data-slot="checkbox"]')[index]?.getAttribute('data-state')

describe('vue checkbox checked', () => {
  it('checks, clears, and stays clear while disabled', async () => {
    const seen: Array<boolean | 'indeterminate'> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Checkbox, { onChange: (value: boolean | 'indeterminate') => seen.push(value) }),
        h(Checkbox, { disabled: true }),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const boxes = () => document.querySelectorAll('[data-slot="checkbox"]')
    expect(state(0)).toBe('unchecked')
    expect(document.querySelector('[role="status"]')).toBeNull()
    ;(boxes()[0] as HTMLButtonElement).click()
    await nextTick()
    expect(state(0)).toBe('checked')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Checked')
    ;(boxes()[0] as HTMLButtonElement).click()
    await nextTick()
    expect(state(0)).toBe('unchecked')
    expect(document.querySelector('[role="status"]')).toBeNull()
    ;(boxes()[1] as HTMLButtonElement).click()
    await nextTick()
    expect(state(1)).toBe('unchecked')
    expect(seen).toEqual([true, false])
  })

  it('stays clear while read-only', async () => {
    const seen: Array<boolean | 'indeterminate'> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Checkbox, {
          readOnly: true,
          checked: false,
          onChange: (value: boolean | 'indeterminate') => seen.push(value),
        }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    ;(document.querySelector('[data-slot="checkbox"]') as HTMLButtonElement).click()
    await nextTick()
    expect(state(0)).toBe('unchecked')
    expect(seen).toEqual([])
  })

  it('stays unchecked when the model is null', async () => {
    const seen: Array<boolean | 'indeterminate'> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Checkbox, { modelValue: null, onChange: (value: boolean | 'indeterminate') => seen.push(value) }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(state(0)).toBe('unchecked')
    ;(document.querySelector('[data-slot="checkbox"]') as HTMLButtonElement).click()
    await nextTick()
    expect(state(0)).toBe('unchecked')
    expect(seen).toEqual([true])
  })

  it('announces indeterminate as mixed and follows a later mixed value', async () => {
    const View = defineComponent({
      setup() {
        const checked = ref<boolean | 'indeterminate'>(false)
        return () =>
          h('div', [
            h(Checkbox, { checked: checked.value }),
            h('button', { type: 'button', onClick: () => (checked.value = 'indeterminate') }, 'Mix'),
          ])
      },
    })
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(View)
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = () => host.querySelector('input')
    expect(state(0)).toBe('unchecked')
    expect(input()?.getAttribute('aria-checked')).toBeNull()
    const mix = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Mix')
    mix?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(state(0)).toBe('indeterminate')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Mixed')
    expect(input()?.getAttribute('aria-checked')).toBe('mixed')
  })

  it('announces a required checkbox and leaves an omitted checkbox optional', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Checkbox, { required: true }), h(Checkbox)]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const inputs = host.querySelectorAll('input')
    expect(inputs[0]?.required).toBe(true)
    expect(inputs[1]?.required).toBe(false)
  })

  it('names the checkbox from aria-label and uses Checkbox when omitted', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Checkbox, { 'aria-label': 'Accept terms' }), h(Checkbox)]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const boxes = host.querySelectorAll('input')
    expect(boxes[0]?.getAttribute('aria-label')).toBe('Accept terms')
    expect(boxes[1]?.getAttribute('aria-label')).toBe('Checkbox')
  })
})
