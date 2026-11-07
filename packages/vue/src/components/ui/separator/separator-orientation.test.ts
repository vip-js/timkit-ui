import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Separator from './separator.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue separator orientation', () => {
  it('is decorative by default and exposes a vertical separator when asked', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Separator), h(Separator, { orientation: 'vertical', decorative: false })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const line = (index: number) => document.querySelectorAll('[data-slot="separator"]')[index] as HTMLElement
    expect(line(0).getAttribute('data-orientation')).toBe('horizontal')
    expect(line(0).getAttribute('role')).toBe('none')
    expect(line(0).hasAttribute('aria-orientation')).toBe(false)
    expect(line(1).getAttribute('data-orientation')).toBe('vertical')
    expect(line(1).getAttribute('role')).toBe('separator')
    expect(line(1).getAttribute('aria-orientation')).toBe('vertical')
  })
})
