import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Badge from './badge.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue badge variant', () => {
  it('marks the default and destructive badges', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Badge, () => 'New'), h(Badge, { variant: 'destructive' }, () => 'Failed')]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const badge = (index: number) => document.querySelectorAll('[data-slot="badge"]')[index] as HTMLElement
    expect(badge(0).getAttribute('data-variant')).toBe('default')
    expect(badge(0).className).toContain('bg-primary')
    expect(badge(0).querySelector('[role="status"]')).toBeNull()
    expect(badge(1).getAttribute('data-variant')).toBe('destructive')
    expect(badge(1).querySelector('[role="status"]')?.textContent).toBe('Destructive')
    expect(badge(1).className).toContain('bg-destructive')
  })
})
