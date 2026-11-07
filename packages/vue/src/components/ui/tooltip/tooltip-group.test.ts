import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Tooltip from './tooltip.vue'
import TooltipContent from './tooltip-content.vue'
import TooltipProvider from './tooltip-provider.vue'
import TooltipTrigger from './tooltip-trigger.vue'

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
  vi.useRealTimers()
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const pointer = (index: number, name: 'onPointerover' | 'onPointerleave') => {
  const trigger = document.querySelectorAll('[data-slot="tooltip-trigger"]')[index] as HTMLElement & {
    __vueParentComponent?: { vnode?: { props?: Record<string, ((event: Event) => void) | undefined> } }
  }
  const handler = trigger.__vueParentComponent?.vnode?.props?.[name]
  if (typeof handler !== 'function') throw new Error(`tooltip trigger has no ${name}`)
  handler(new PointerEvent(name === 'onPointerover' ? 'pointerover' : 'pointerleave', { bubbles: true, pointerType: 'mouse' }))
}

describe('vue tooltip group', () => {
  it('opens the next tooltip immediately and keeps content hoverable when asked', async () => {
    vi.useFakeTimers()
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(TooltipProvider, { delayDuration: 700, skipDelayDuration: 500, disableHoverableContent: false }, () => [
          h(Tooltip, () => [h(TooltipTrigger, () => 'One'), h(TooltipContent, () => 'First')]),
          h(Tooltip, () => [h(TooltipTrigger, () => 'Two'), h(TooltipContent, () => 'Second')]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    pointer(0, 'onPointerover')
    await nextTick()
    vi.advanceTimersByTime(699)
    await nextTick()
    expect(document.body.textContent).not.toContain('First')
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(document.body.textContent).toContain('First')
    const content = document.querySelector('[data-slot="tooltip-content"]') as HTMLElement
    expect(content.style.pointerEvents).toBe('auto')
    pointer(0, 'onPointerleave')
    await nextTick()
    vi.advanceTimersByTime(150)
    await nextTick()
    pointer(1, 'onPointerover')
    await nextTick()
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(document.body.textContent).toContain('Second')
  })
})
