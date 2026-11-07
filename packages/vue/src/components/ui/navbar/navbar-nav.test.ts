import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import NavbarNav from './navbar-nav.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue navbar nav', () => {
  it('names an omitted navigation Navigation and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(NavbarNav), h(NavbarNav, { 'aria-label': 'Sections' })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const labels = [...host.querySelectorAll('[data-slot="navbar-nav"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Navigation', 'Sections'])
  })
})
