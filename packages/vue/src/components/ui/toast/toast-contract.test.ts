import { createApp, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Toast from './toast.vue'
import ToastClose from './toast-close.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue toast contract', () => {
  it('uses the destructive style and closes when the close button is pressed', async () => {
    const changes: boolean[] = []
    const open = ref(true)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      setup: () => () =>
        h(
          Toast,
          {
            variant: 'destructive',
            open: open.value,
            onOpenChange: (next: boolean) => {
              changes.push(next)
              open.value = next
            },
          },
          () => [h(ToastClose), 'Removed']
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const toast = document.querySelector('[data-slot="toast"]')
    expect(document.querySelector('button')?.getAttribute('aria-label')).toBe('Close')
    expect(document.querySelector('button svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(toast?.className).toContain('bg-destructive')
    expect(toast?.getAttribute('data-state')).toBe('open')
    document.querySelector('button')?.click()
    await nextTick()
    expect(changes).toEqual([false])
    expect(document.querySelector('[data-slot="toast"]')).toBeNull()
  })

  it('follows a later open value', async () => {
    const open = ref(true)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      setup: () => () =>
        h('div', [
          h('button', { type: 'button', onClick: () => (open.value = false) }, 'Hide'),
          h('button', { type: 'button', onClick: () => (open.value = true) }, 'Show'),
          h(Toast, { open: open.value }, () => 'Saved'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="toast"]')?.textContent).toContain('Saved')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Hide')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.querySelector('[data-slot="toast"]')).toBeNull()
    expect(document.querySelector('[role="status"]')).toBeNull()
    press('Show')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.querySelector('[data-slot="toast"]')?.textContent).toContain('Saved')
  })

  it('pauses and resumes once', async () => {
    const paused: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Toast,
          {
            onPause: () => paused.push('pause'),
            onResume: () => paused.push('resume'),
          },
          () => 'Saved'
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const toast = document.querySelector('[data-slot="toast"]') as HTMLElement
    toast.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    toast.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    expect(paused).toEqual(['pause', 'resume'])
  })

  it('stays visible when open is omitted', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Toast, null, () => 'Saved'),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="toast"]')?.textContent).toContain('Saved')
  })
})
