import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Dialog from './dialog.vue'
import DialogContent from './dialog-content.vue'
import DialogDescription from './dialog-description.vue'
import DialogTitle from './dialog-title.vue'
import DialogTrigger from './dialog-trigger.vue'

const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}
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

describe('vue dialog open', () => {
  it('follows a later open value and stays closed while the trigger is disabled', async () => {
    const open = ref(false)
    const locked = ref(false)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () => [
            h('button', { type: 'button', onClick: () => (open.value = true) }, 'Show'),
            h('button', { type: 'button', onClick: () => (open.value = false) }, 'Hide'),
            h('button', { type: 'button', onClick: () => (locked.value = true) }, 'Unlock'),
            h(Dialog, { open: open.value }, () => [
              h(DialogTrigger, () => 'Open'),
              h(DialogContent, () => [h(DialogTitle, () => 'Details')]),
            ]),
            h(Dialog, { open: locked.value }, () => [
              h(DialogTrigger, { disabled: true }, () => 'Locked'),
              h(DialogContent, () => [h(DialogTitle, () => 'Hidden')]),
            ]),
          ]
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="dialog-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    trigger('Locked').click()
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
    press('Hide')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
  })

  it('opens, closes, and stays closed while the trigger is disabled', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Dialog, { onOpenChange: (open: boolean) => seen.push(open) }, () => [
          h(DialogTrigger, () => 'Open'),
          h(DialogContent, () => [h(DialogTitle, () => 'Details')]),
        ]),
        h(Dialog, () => [
          h(DialogTrigger, { disabled: true }, () => 'Locked'),
          h(DialogContent, () => [h(DialogTitle, () => 'Hidden')]),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="dialog-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    trigger('Open').click()
    await nextTick()
    expect(document.body.textContent).toContain('Details')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Opened')
    ;(document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement).click()
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    expect(host.querySelector('[role="status"]')).toBeNull()
    trigger('Locked').click()
    await nextTick()
    expect(document.body.textContent).not.toContain('Hidden')
    expect(seen).toEqual([true, false])
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Dialog,
          { open: null, defaultOpen: true, onOpenChange: (open: boolean) => seen.push(open) },
          () => [h(DialogTrigger, () => 'Open'), h(DialogContent, () => [h(DialogTitle, () => 'Details')])]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="dialog-trigger"]') as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    trigger.click()
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    expect(seen).toEqual([true])
  })

  it('ignores opening while the dialog is disabled', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Dialog, { disabled: true, onOpenChange: (open: boolean) => seen.push(open) }, () => [
          h(DialogTrigger, () => 'Open'),
          h(DialogContent, () => [h(DialogTitle, () => 'Details')]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="dialog-trigger"]') as HTMLButtonElement
    trigger.click()
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    expect(trigger.disabled).toBe(true)
    expect(seen).toEqual([])
  })

  it('drops the overlay when the dialog is not modal', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Dialog, { defaultOpen: true, modal: false }, () => [
          h(DialogContent, () => [h(DialogTitle, () => 'Note')]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="dialog-content"]')?.getAttribute('aria-modal')).toBe('false')
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeNull()
  })

  it('keeps the overlay when the dialog is modal', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Dialog, { defaultOpen: true }, () => [h(DialogContent, () => [h(DialogTitle, () => 'Note')])]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="dialog-content"]')?.getAttribute('aria-modal')).toBe('true')
    expect(document.querySelector('[data-slot="dialog-overlay"]')).not.toBeNull()
  })

  it('names the dialog from its title', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Dialog, { defaultOpen: true }, () => [
          h(DialogContent, () => [
            h(DialogTitle, () => 'Details'),
            h(DialogDescription, () => 'More about this dialog.'),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const content = document.querySelector('[data-slot="dialog-content"]')
    const title = document.querySelector('[data-slot="dialog-title"]')
    expect(title?.textContent).toContain('Details')
    const description = document.querySelector('[data-slot="dialog-description"]')
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id)
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id)
    expect(content?.getAttribute('aria-label')).toBeNull()
  })

  it('names an omitted dialog Dialog and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Dialog, { defaultOpen: true }, () => [h(DialogContent)]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.querySelector('[data-slot="dialog-content"]')?.getAttribute('aria-label')).toBe('Dialog')
    const namedHost = document.createElement('div')
    document.body.append(namedHost)
    const named = createApp({
      render: () => h(Dialog, { defaultOpen: true }, () => [h(DialogContent, { 'aria-label': 'Notice' })]),
    })
    named.mount(namedHost)
    mounted.push({ unmount: () => named.unmount(), host: namedHost })
    await nextTick()
    expect(namedHost.ownerDocument.querySelectorAll('[data-slot="dialog-content"]')[1]?.getAttribute('aria-label')).toBe(
      'Notice'
    )
  })
})
