import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Button from './button.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue button loading', () => {
  it('ignores a press while loading and sets aria-busy', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Button, { loading: true, onPress: () => seen.push('loading') }, () => 'Save'),
          h(Button, { disabled: true, onPress: () => seen.push('disabled') }, () => 'Hold'),
          h(Button, { onPress: () => seen.push('ready') }, () => 'Go'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const buttons = () => host.querySelectorAll('button')
    expect(buttons()[0]?.getAttribute('aria-busy')).toBe('true')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Loading')
    expect((buttons()[0] as HTMLButtonElement).disabled).toBe(true)
    expect((buttons()[1] as HTMLButtonElement).disabled).toBe(true)
    buttons()[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    buttons()[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    buttons()[2]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    await nextTick()
    expect(seen).toEqual(['ready'])
  })

  it('uses type button unless a type is passed', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Button, {}, () => 'Go'),
          h(Button, { type: 'submit' }, () => 'Save'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const buttons = host.querySelectorAll('button')
    expect(buttons[0]?.getAttribute('type')).toBe('button')
    expect(buttons[1]?.getAttribute('type')).toBe('submit')
  })
})
