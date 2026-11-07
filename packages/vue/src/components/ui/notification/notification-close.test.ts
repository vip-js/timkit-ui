import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Notification from './notification.vue'
import NotificationIcon from './notification-icon.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  vi.useRealTimers()
})

const show = (props: Record<string, unknown> = {}) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () => h(Notification, props, () => 'Saved'),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  return host
}

describe('vue notification close', () => {
  it('closes from the button and from the timer, and ignores a manual close when it is not closable', async () => {
    vi.useFakeTimers()
    const closed: string[] = []
    const enabled = show({ duration: 1000, onClose: () => closed.push('close') })
    await nextTick()
    expect(enabled.querySelector('[data-slot="notification"]')).toBeTruthy()
    ;(enabled.querySelector('[data-slot="notification-close"]') as HTMLButtonElement).click()
    await nextTick()
    expect(enabled.querySelector('[data-slot="notification"]')).toBeNull()
    expect(closed).toEqual(['close'])

    const timed: string[] = []
    show({ duration: 1000, closable: false, onClose: () => timed.push('close') })
    await nextTick()
    expect(document.querySelector('[data-slot="notification-close"]')).toBeNull()
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(document.querySelector('[data-slot="notification"]')).toBeNull()
    expect(timed).toEqual(['close'])
  })

  it('stays open until the controlled value changes and starts closed from defaultOpen', async () => {
    const seen: boolean[] = []
    const open = ref<boolean | null>(true)
    const Held = defineComponent({
      setup() {
        return () =>
          h(
            Notification,
            {
              duration: 0,
              open: open.value,
              defaultOpen: false,
              onOpenChange: (next: boolean) => {
                seen.push(next)
              },
            },
            () => 'Saved'
          )
      },
    })
    const held = document.createElement('div')
    document.body.append(held)
    const app = createApp(Held)
    app.mount(held)
    mounted.push({ unmount: () => app.unmount(), host: held })
    await nextTick()
    expect(held.querySelector('[data-slot="notification"]')).toBeTruthy()
    ;(held.querySelector('[data-slot="notification-close"]') as HTMLButtonElement).click()
    await nextTick()
    expect(held.querySelector('[data-slot="notification"]')).toBeTruthy()
    expect(seen).toEqual([false])
    open.value = false
    await nextTick()
    expect(held.querySelector('[data-slot="notification"]')).toBeNull()
    open.value = null
    await nextTick()
    expect(held.querySelector('[data-slot="notification"]')).toBeNull()

    const preset = show({ duration: 0, defaultOpen: false })
    await nextTick()
    expect(preset.querySelector('[data-slot="notification"]')).toBeNull()
  })

  it('hides the icon from the notification name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Notification, () => [h(NotificationIcon, () => '!'), 'Saved']),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="notification-icon"]')?.getAttribute('aria-hidden')).toBe('true')
  })
})
