import { createApp, h, nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import AlertDialog from './alert-dialog.vue'
import AlertDialogAction from './alert-dialog-action.vue'
import AlertDialogCancel from './alert-dialog-cancel.vue'
import AlertDialogContent from './alert-dialog-content.vue'
import AlertDialogDescription from './alert-dialog-description.vue'
import AlertDialogTitle from './alert-dialog-title.vue'
import AlertDialogTrigger from './alert-dialog-trigger.vue'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (props: Record<string, unknown> = {}) => {
  const host = document.createElement('div')
  document.body.append(host)
  const confirmed: string[] = []
  const app = createApp({
    render: () =>
      h(AlertDialog, props, () => [
        h(AlertDialogTrigger, () => 'Open'),
        h(AlertDialogContent, () => [
          h(AlertDialogCancel, () => 'Cancel'),
          h(AlertDialogAction, { onClick: () => confirmed.push('yes') }, () => 'Confirm'),
        ]),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  return confirmed
}

const click = (selector: string) => {
  const node = document.querySelector(selector) as HTMLElement | null
  if (!node) throw new Error(`missing ${selector}`)
  node.click()
}

describe('vue alert dialog confirm', () => {
  it('opens, confirms, and ignores a disabled dialog or the backdrop', async () => {
    const confirmed = show()
    await nextTick()
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeNull()
    const trigger = document.querySelector('[data-slot="alert-dialog-trigger"]') as HTMLButtonElement
    click('[data-slot="alert-dialog-trigger"]')
    await nextTick()
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeTruthy()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    click('[data-slot="alert-dialog-overlay"]')
    await nextTick()
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeTruthy()
    click('[data-slot="alert-dialog-action"]')
    await nextTick()
    expect(confirmed).toEqual(['yes'])
    const content = document.querySelector('[data-slot="alert-dialog-content"]')
    expect(content === null || content.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector('[role="status"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)

    show({ disabled: true })
    await nextTick()
    const locked = document.querySelectorAll('[data-slot="alert-dialog-trigger"]')[1] as HTMLButtonElement
    expect(locked.disabled).toBe(true)
    locked.click()
    await nextTick()
    const visible = [...document.querySelectorAll('[data-slot="alert-dialog-content"]')].filter(
      (node) => !node.hasAttribute('hidden')
    )
    expect(visible).toEqual([])
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          AlertDialog,
          { open: null, defaultOpen: true, onOpenChange: (open: boolean) => seen.push(open) },
          () => [
            h(AlertDialogTrigger, () => 'Open'),
            h(AlertDialogContent, () => h(AlertDialogAction, () => 'Confirm')),
          ]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeNull()
    ;(document.querySelector('[data-slot="alert-dialog-trigger"]') as HTMLButtonElement).click()
    await nextTick()
    await Promise.resolve()
    await nextTick()
    const visible = [...document.querySelectorAll('[data-slot="alert-dialog-content"]')].filter(
      (node) => !node.hasAttribute('hidden')
    )
    expect(visible).toEqual([])
    expect(seen).toEqual([true])
  })

  it('names an omitted alert dialog Alert dialog and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(AlertDialog, { defaultOpen: true }, () => h(AlertDialogContent)),
          h(AlertDialog, { defaultOpen: true }, () => h(AlertDialogContent, { 'aria-label': 'Delete file' })),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const labels = [...document.querySelectorAll('[data-slot="alert-dialog-content"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Alert dialog', 'Delete file'])
  })

  it('names the alert dialog from its title', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(AlertDialog, { defaultOpen: true }, () =>
          h(AlertDialogContent, () => [
            h(AlertDialogTitle, () => 'Delete file'),
            h(AlertDialogDescription, () => 'This cannot be undone.'),
          ])
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const content = document.querySelector('[data-slot="alert-dialog-content"]')
    const title = document.querySelector('[data-slot="alert-dialog-title"]')
    const description = document.querySelector('[data-slot="alert-dialog-description"]')
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id)
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id)
    expect(content?.getAttribute('aria-label')).toBeNull()
  })
})
