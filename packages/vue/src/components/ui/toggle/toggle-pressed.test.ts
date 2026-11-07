import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Toggle from './toggle.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue toggle pressed', () => {
  it('follows a later pressed value and ignores a disabled toggle', async () => {
    const pressed = ref(false)
    const locked = ref(false)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (pressed.value = true) }, 'On'),
              h('button', { type: 'button', onClick: () => (locked.value = true) }, 'Unlock'),
              h(Toggle, { pressed: pressed.value }, () => 'Bold'),
              h(Toggle, { disabled: true, pressed: locked.value }, () => 'Locked'),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const toggle = (index: number) => host.querySelectorAll('[data-slot="toggle"]')[index] as HTMLButtonElement
    expect(toggle(0).getAttribute('data-state')).toBe('off')
    expect(toggle(1).getAttribute('data-state')).toBe('off')
    toggle(1).click()
    await nextTick()
    expect(toggle(1).getAttribute('data-state')).toBe('off')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('On')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    press('Unlock')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(toggle(0).getAttribute('data-state')).toBe('on')
    expect(toggle(1).getAttribute('data-state')).toBe('on')
  })

  it('turns on and off, and ignores a disabled toggle', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Toggle, { onPressedChange: (pressed: boolean) => seen.push(pressed) }, () => 'Bold'),
          h(Toggle, { disabled: true }, () => 'Locked'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const toggle = (index: number) => document.querySelectorAll('[data-slot="toggle"]')[index] as HTMLButtonElement
    expect(toggle(0).getAttribute('data-state')).toBe('off')
    expect(document.querySelector('[role="status"]')).toBeNull()
    toggle(0).click()
    await nextTick()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Pressed')
    expect(toggle(0).getAttribute('aria-pressed')).toBe('true')
    expect(toggle(0).getAttribute('data-state')).toBe('on')
    expect(seen).toEqual([true])
    toggle(0).click()
    await nextTick()
    expect(toggle(0).getAttribute('data-state')).toBe('off')
    expect(document.querySelector('[role="status"]')).toBeNull()
    expect(seen).toEqual([true, false])
    toggle(1).click()
    await nextTick()
    expect(toggle(1).disabled).toBe(true)
    expect(toggle(1).getAttribute('data-state')).toBe('off')
  })

  it('stays off when pressed is null even if the default is on', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Toggle,
          {
            pressed: null,
            defaultPressed: true,
            onPressedChange: (pressed: boolean) => seen.push(pressed),
          },
          () => 'Bold'
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const toggle = host.querySelector('[data-slot="toggle"]') as HTMLButtonElement
    expect(toggle.getAttribute('data-state')).toBe('off')
    toggle.click()
    await nextTick()
    expect(toggle.getAttribute('data-state')).toBe('off')
    expect(seen).toEqual([true])
  })
})
