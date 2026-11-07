import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import ScrollArea from './scroll-area.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const viewport = () => document.querySelector('[data-slot="scroll-viewport"]') as HTMLElement

describe('vue scroll area orientation', () => {
  it('scrolls on the requested axis', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const orientation = { value: 'vertical' as 'vertical' | 'horizontal' | 'both' }
    const app = createApp({
      setup: () => ({ orientation }),
      render: () => h(ScrollArea, { orientation: orientation.value }, () => 'Body'),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(viewport().getAttribute('data-orientation')).toBe('vertical')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Vertical')
    expect(viewport().style.overflowY).toBe('auto')
    expect(viewport().style.overflowX).toBe('hidden')
    orientation.value = 'horizontal'
    app._instance?.update()
    await nextTick()
    expect(viewport().getAttribute('data-orientation')).toBe('horizontal')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Horizontal')
    expect(viewport().style.overflowX).toBe('auto')
    expect(viewport().style.overflowY).toBe('hidden')
    orientation.value = 'both'
    app._instance?.update()
    await nextTick()
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Both')
  })

  it('names an omitted scroller Scroll area and lets aria-labelledby suppress that name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(ScrollArea, () => 'One'),
          h(ScrollArea, { 'aria-label': 'Notes' }, () => 'Two'),
          h(ScrollArea, { 'aria-label': 'Notes', 'aria-labelledby': 'notes-title' }, () => 'Three'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const views = [...host.querySelectorAll('[data-slot="scroll-viewport"]')]
    expect(views.map((node) => node.getAttribute('aria-label'))).toEqual(['Scroll area', 'Notes', null])
    expect(views[2]?.getAttribute('aria-labelledby')).toBe('notes-title')
  })
})
