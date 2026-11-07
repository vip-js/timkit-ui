import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Label from './label.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue label htmlFor', () => {
  it('focuses the labelled field', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Label, { htmlFor: 'email' }, () => 'Email'), h('input', { id: 'email' })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const label = document.querySelector('[data-slot="label"]') as HTMLLabelElement
    const field = document.querySelector('#email') as HTMLInputElement
    expect(label.htmlFor).toBe('email')
    label.click()
    expect(document.activeElement).toBe(field)
  })
})
