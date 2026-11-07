import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Tooltip from './tooltip.vue'
import TooltipContent from './tooltip-content.vue'
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

const show = () => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(Tooltip, { delayDuration: 700 }, () => [
        h(TooltipTrigger, () => 'Hint'),
        h(TooltipContent, () => 'Details'),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
}

const hover = () => {
  const trigger = document.querySelector('[data-slot="tooltip-trigger"]') as HTMLElement & {
    __vueParentComponent?: { vnode?: { props?: Record<string, unknown> } }
  }
  const handler = trigger.__vueParentComponent?.vnode?.props?.onPointerover
  if (typeof handler !== 'function') throw new Error('tooltip trigger has no pointer handler')
  handler(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
}

describe('vue tooltip delayDuration', () => {
  it('follows a later open value and stays closed while disabled', async () => {
    vi.useFakeTimers()
    const open = ref(false)
    const locked = ref(false)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () => [
            h('button', { type: 'button', onClick: () => (open.value = true) }, 'Show'),
            h('button', { type: 'button', onClick: () => (locked.value = true) }, 'Unlock'),
            h(
              'button',
              {
                type: 'button',
                onClick: () => {
                  open.value = false
                  locked.value = false
                },
              },
              'Reset'
            ),
            h(Tooltip, { open: open.value, delayDuration: 700 }, () => [
              h(TooltipTrigger, () => 'Hint'),
              h(TooltipContent, () => 'Details'),
            ]),
            h(Tooltip, { open: locked.value, disabled: true, delayDuration: 700 }, () => [
              h(TooltipTrigger, () => 'Locked'),
              h(TooltipContent, () => 'Hidden'),
            ]),
          ]
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tooltip-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLElement
    expect(document.body.textContent).not.toContain('Details')
    expect(document.body.textContent).not.toContain('Hidden')
    trigger('Locked').dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
    await vi.advanceTimersByTimeAsync(700)
    await nextTick()
    expect(document.body.textContent).not.toContain('Hidden')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Show')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    press('Unlock')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(document.body.textContent).toContain('Details')
    expect(document.body.textContent).toContain('Hidden')
    const reset = [...host.querySelectorAll('button')].find((button) => button.textContent === 'Reset')
    reset?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
  })

  it('keeps the tooltip closed until the requested delay elapses', async () => {
    vi.useFakeTimers()
    show()
    await nextTick()
    hover()
    await nextTick()
    vi.advanceTimersByTime(699)
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    expect(document.querySelector('[role="status"]')).toBeNull()
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    expect(document.querySelector('[data-slot="tooltip-trigger"]')?.getAttribute('data-state')).toBe('open')
    expect(document.body.textContent).toContain('Details')
    const hint = document.querySelector('[data-slot="tooltip-trigger"]')
    const content = document.querySelector('[data-slot="tooltip-content"]')
    expect(content?.getAttribute('role')).toBe('tooltip')
    expect(hint?.getAttribute('aria-describedby')).toBe(content?.id)
  })

  it('uses delayDuration instead of the longer openDelay', async () => {
    vi.useFakeTimers()
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Tooltip, { delayDuration: 40, openDelay: 700 }, () => [
          h(TooltipTrigger, () => 'Hint'),
          h(TooltipContent, () => 'Soon'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = host.querySelector('[data-slot="tooltip-trigger"]') as HTMLElement & {
      __vueParentComponent?: { vnode?: { props?: Record<string, unknown> } }
    }
    const handler = trigger.__vueParentComponent?.vnode?.props?.onPointerover
    if (typeof handler !== 'function') throw new Error('tooltip trigger has no pointer handler')
    handler(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
    await nextTick()
    vi.advanceTimersByTime(39)
    await nextTick()
    expect(document.body.textContent).not.toContain('Soon')
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(document.body.textContent).toContain('Soon')
  })
})