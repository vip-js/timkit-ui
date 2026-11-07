import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Popover from './popover.vue'
import PopoverContent from './popover-content.vue'
import PopoverTrigger from './popover-trigger.vue'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const click = async (index: number) => {
  const button = document.querySelectorAll('[data-slot="popover-trigger"]')[index] as HTMLElement & {
    __vueParentComponent?: { vnode?: { props?: { onClick?: (event: Event) => void } } }
  }
  const handler = button.__vueParentComponent?.vnode?.props?.onClick
  if (typeof handler !== 'function') throw new Error('popover trigger has no click handler')
  const event = new MouseEvent('click', { bubbles: true })
  Object.defineProperty(event, 'currentTarget', { value: button })
  handler(event)
  await nextTick()
}

describe('vue popover', () => {
  it('opens on click, closes on the next click, and stays closed when disabled', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Popover, { onOpenChange: (open: boolean) => seen.push(open) }, () => [
          h(PopoverTrigger, () => 'Open'),
          h(PopoverContent, () => 'Details'),
        ]),
        h(Popover, { disabled: true }, () => [
          h(PopoverTrigger, () => 'Locked'),
          h(PopoverContent, () => 'Hidden'),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    await click(0)
    expect(document.body.textContent).toContain('Details')
    const opened = document.querySelector('[data-slot="popover-trigger"]')
    expect(opened?.getAttribute('aria-haspopup')).toBe('dialog')
    expect(opened?.getAttribute('aria-expanded')).toBe('true')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Opened')
    await click(0)
    expect(document.body.textContent).not.toContain('Details')
    expect(host.querySelector('[role="status"]')).toBeNull()
    expect(document.activeElement).toBe(document.querySelectorAll('[data-slot="popover-trigger"]')[0])
    await click(1)
    expect(document.body.textContent).not.toContain('Hidden')
    expect(seen).toEqual([true, false])
  })

  it('sets aria-modal only when modal is true', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Popover, { modal: true }, () => [h(PopoverTrigger, () => 'Modal'), h(PopoverContent, () => 'Modal body')]),
        h(Popover, () => [h(PopoverTrigger, () => 'Plain'), h(PopoverContent, () => 'Plain body')]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await click(0)
    await click(1)
    const content = (text: string) =>
      [...document.querySelectorAll('[data-slot="popover-content"]')].find((node) => node.textContent?.includes(text))
    expect(content('Modal body')?.getAttribute('aria-modal')).toBe('true')
    expect(content('Plain body')?.getAttribute('aria-modal')).toBeNull()
  })

  it('names an omitted popover Popover and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Popover, () => [h(PopoverTrigger, () => 'Open'), h(PopoverContent, () => 'Body')]),
        h(Popover, () => [
          h(PopoverTrigger, () => 'Named'),
          h(PopoverContent, { 'aria-label': 'Details' }, () => 'Body'),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await click(0)
    await click(1)
    const labels = [...document.querySelectorAll('[data-slot="popover-content"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Popover', 'Details'])
    const content = document.querySelector('[data-slot="popover-content"]')
    const buttons = document.querySelectorAll('[data-slot="popover-trigger"]')
    expect(buttons[0]?.getAttribute('aria-controls')).toBe(content?.id)
    expect(content?.getAttribute('role')).toBe('dialog')
    expect(buttons[0]?.getAttribute('aria-haspopup')).toBe('dialog')
  })
})
