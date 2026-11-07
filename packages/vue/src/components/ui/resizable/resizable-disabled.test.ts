import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable.vue'

const originalRect = HTMLElement.prototype.getBoundingClientRect

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  HTMLElement.prototype.getBoundingClientRect = originalRect
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

HTMLElement.prototype.getBoundingClientRect = function () {
  if (this.getAttribute('data-slot') === 'resizable-panel') {
    const basis = parseFloat(this.style.flexBasis || '50')
    const width = basis * 4
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 100,
      width,
      height: 100,
      toJSON() {
        return {}
      },
    }
  }
  return { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON() { return {} } }
}

const show = async (disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(ResizablePanelGroup, { direction: 'horizontal' }, () => [
        h(ResizablePanel, { defaultSize: 50, minSize: 20, maxSize: 80 }, () => 'Left'),
        h(ResizableHandle, { disabled }),
        h(ResizablePanel, { defaultSize: 50, minSize: 20, maxSize: 80 }, () => 'Right'),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const basis = () =>
  (document.querySelector('[data-slot="resizable-panel"]') as HTMLElement).style.flexBasis

describe('vue resizable', () => {
  it('grows the first panel from the keyboard and ignores a disabled handle', async () => {
    await show()
    const handle = document.querySelector('[data-slot="resizable-handle"]') as HTMLElement
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    expect(basis()).not.toBe('50%')

    document.body.innerHTML = ''
    await show(true)
    const blocked = document.querySelector('[data-slot="resizable-handle"]') as HTMLElement
    blocked.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    expect(basis()).toBe('50%')
    expect(blocked.getAttribute('aria-disabled')).toBe('true')
  })
})
