import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import HoverCard from './hover-card.vue'
import HoverCardContent from './hover-card-content.vue'
import HoverCardTrigger from './hover-card-trigger.vue'

globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

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

const show = (disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(HoverCard, { openDelay: 40, closeDelay: 20, disabled }, () => [
        h(HoverCardTrigger, () => 'Preview'),
        h(HoverCardContent, () => (disabled ? 'Hidden body' : 'Card body')),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
}

const enter = () => {
  const trigger = document.querySelector('[data-slot="hover-card-trigger"]') as HTMLElement & {
    __vueParentComponent?: { vnode?: { props?: Record<string, unknown> } }
  }
  const handler = trigger.__vueParentComponent?.vnode?.props?.onPointerenter
  if (typeof handler !== 'function') throw new Error('hover card trigger has no pointer handler')
  handler(new PointerEvent('pointerenter', { bubbles: true, pointerType: 'mouse' }))
}

describe('vue hover card open', () => {
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
            h(HoverCard, { open: open.value, openDelay: 40 }, () => [
              h(HoverCardTrigger, () => 'Preview'),
              h(HoverCardContent, () => 'Card body'),
            ]),
            h(HoverCard, { open: locked.value, disabled: true, openDelay: 40 }, () => [
              h(HoverCardTrigger, () => 'Locked'),
              h(HoverCardContent, () => 'Hidden body'),
            ]),
          ]
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="hover-card-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLElement
    expect(document.body.textContent).not.toContain('Card body')
    expect(document.body.textContent).not.toContain('Hidden body')
    trigger('Locked').dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
    await vi.advanceTimersByTimeAsync(40)
    await nextTick()
    expect(document.body.textContent).not.toContain('Hidden body')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Show')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    press('Unlock')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(document.body.textContent).toContain('Card body')
    expect(document.body.textContent).toContain('Hidden body')
    const content = [...document.querySelectorAll('[data-slot="hover-card-content"]')].find((node) =>
      node.textContent?.includes('Card body')
    )
    expect(trigger('Preview').getAttribute('aria-describedby')).toBe(content?.id)
    expect(content?.getAttribute('role')).toBeNull()
  })

  it('opens after the delay and stays closed while disabled', async () => {
    vi.useFakeTimers()
    show()
    await nextTick()
    enter()
    await nextTick()
    vi.advanceTimersByTime(39)
    await nextTick()
    expect(document.body.textContent).not.toContain('Card body')
    expect(document.querySelector('[role="status"]')).toBeNull()
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(document.body.textContent).toContain('Card body')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')

    document.body.innerHTML = ''
    show(true)
    await nextTick()
    enter()
    vi.advanceTimersByTime(40)
    await nextTick()
    expect(document.body.textContent).not.toContain('Hidden body')
  })

  it('opens from focus after the delay', async () => {
    vi.useFakeTimers()
    show()
    await nextTick()
    const trigger = document.querySelector('[data-slot="hover-card-trigger"]') as HTMLElement
    trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    vi.advanceTimersByTime(39)
    await nextTick()
    expect(document.body.textContent).not.toContain('Card body')
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(document.body.textContent).toContain('Card body')
    trigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    await nextTick()
    expect(trigger.getAttribute('data-state')).toBe('closed')
    expect(document.body.textContent).not.toContain('Card body')
  })
})
