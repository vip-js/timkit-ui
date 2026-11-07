import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Switch from './switch.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const checked = (index: number) =>
  document.querySelectorAll('[data-slot="switch"]')[index]?.getAttribute('data-state')

describe('vue switch checked', () => {
  it('follows a later checked value and keeps a disabled switch still', async () => {
    const on = ref(false)
    const locked = ref(false)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (on.value = true) }, 'On'),
              h('button', { type: 'button', onClick: () => (locked.value = true) }, 'Lock'),
              h(Switch, { checked: on.value }),
              h(Switch, { disabled: true, checked: locked.value }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const buttons = () => host.querySelectorAll('[data-slot="switch"]')
    expect(buttons()[0]?.getAttribute('data-state')).toBe('unchecked')
    expect(buttons()[1]?.getAttribute('data-state')).toBe('unchecked')
    ;(buttons()[1] as HTMLButtonElement).click()
    await nextTick()
    expect(buttons()[1]?.getAttribute('data-state')).toBe('unchecked')
    const click = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    click('On')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('Lock')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(buttons()[0]?.getAttribute('data-state')).toBe('checked')
    expect(buttons()[1]?.getAttribute('data-state')).toBe('checked')
  })

  it('turns on, turns off, and stays off while disabled', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Switch, { onChange: (value: boolean) => seen.push(value) }),
        h(Switch, { disabled: true }),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const buttons = () => document.querySelectorAll('[data-slot="switch"]')
    expect(checked(0)).toBe('unchecked')
    expect(document.querySelector('[role="status"]')).toBeNull()
    ;(buttons()[0] as HTMLButtonElement).click()
    await nextTick()
    expect(checked(0)).toBe('checked')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('On')
    ;(buttons()[0] as HTMLButtonElement).click()
    await nextTick()
    expect(checked(0)).toBe('unchecked')
    expect(document.querySelector('[role="status"]')).toBeNull()
    ;(buttons()[1] as HTMLButtonElement).click()
    await nextTick()
    expect(checked(1)).toBe('unchecked')
    expect(seen).toEqual([true, false])
  })

  it('stays off while read-only', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Switch, { readOnly: true, checked: false, onChange: (value: boolean) => seen.push(value) }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const button = document.querySelector('[data-slot="switch"]') as HTMLButtonElement
    button.click()
    await nextTick()
    expect(button.getAttribute('data-state')).toBe('unchecked')
    expect(seen).toEqual([])
  })

  it('stays off when the model is null', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Switch, { modelValue: null, onChange: (value: boolean) => seen.push(value) }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const button = document.querySelector('[data-slot="switch"]') as HTMLButtonElement
    expect(button.getAttribute('data-state')).toBe('unchecked')
    button.click()
    await nextTick()
    expect(button.getAttribute('data-state')).toBe('unchecked')
    expect(seen).toEqual([true])
  })

  it('announces a required switch and leaves an omitted switch optional', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Switch, { required: true }), h(Switch)]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const inputs = host.querySelectorAll('input')
    expect(inputs[0]?.required).toBe(true)
    expect(inputs[1]?.required).toBe(false)
    expect(inputs[1]?.getAttribute('aria-label')).toBe('Switch')
  })
})
