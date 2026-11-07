import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Sheet from './sheet.vue'
import SheetContent from './sheet-content.vue'
import SheetTitle from './sheet-title.vue'
import SheetTrigger from './sheet-trigger.vue'

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

describe('vue sheet open', () => {
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
            h('button', { type: 'button', onClick: () => (locked.value = true) }, 'Unlock'),
            h(Sheet, { open: open.value }, () => [
              h(SheetTrigger, () => h('button', { type: 'button' }, 'Open')),
              h(SheetContent, () => h(SheetTitle, () => 'Details')),
            ]),
            h(Sheet, { open: locked.value }, () => [
              h(SheetTrigger, () => h('button', { type: 'button', disabled: true }, 'Locked')),
              h(SheetContent, () => h(SheetTitle, () => 'Hidden')),
            ]),
          ]
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...host.querySelectorAll('button')].find((node) => node.textContent === label) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    expect(document.body.textContent).not.toContain('Hidden')
    trigger('Locked').click()
    await nextTick()
    expect(document.body.textContent).not.toContain('Hidden')
    trigger('Show').click()
    trigger('Unlock').click()
    await nextTick()
    await Promise.resolve()
    expect(document.body.textContent).toContain('Details')
    expect(document.body.textContent).toContain('Hidden')
  })

  it('opens, closes, and stays closed while the trigger is disabled', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Sheet, { onOpenChange: (open: boolean) => seen.push(open) }, () => [
          h(SheetTrigger, () => 'Open'),
          h(SheetContent, () => [h(SheetTitle, () => 'Details')]),
        ]),
        h(Sheet, () => [
          h(SheetTrigger, { disabled: true }, () => 'Locked'),
          h(SheetContent, () => [h(SheetTitle, () => 'Hidden')]),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="sheet-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    trigger('Open').click()
    await nextTick()
    expect(document.body.textContent).toContain('Details')
    const content = document.querySelector('[data-slot="sheet-content"]')
    expect(trigger('Open').getAttribute('aria-controls')).toBe(content?.id)
    expect(trigger('Open').getAttribute('aria-haspopup')).toBe('dialog')
    expect(content?.getAttribute('role')).toBe('dialog')
    expect(document.querySelector('[data-slot="sheet-close"] svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Opened')
    ;(document.querySelector('[data-slot="sheet-close"]') as HTMLButtonElement).click()
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
        h(Sheet, { open: null, defaultOpen: true, onOpenChange: (open: boolean) => seen.push(open) }, () => [
          h(SheetTrigger, () => h('button', { type: 'button' }, 'Open')),
          h(SheetContent, () => [h(SheetTitle, () => 'Details')]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = [...document.querySelectorAll('button')].find((node) => node.textContent === 'Open') as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    trigger.click()
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    expect(seen).toEqual([true])
  })

  it('ignores opening while the sheet is disabled', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Sheet, { disabled: true, onOpenChange: (open: boolean) => seen.push(open) }, () => [
          h(SheetTrigger, () => 'Open'),
          h(SheetContent, () => [h(SheetTitle, () => 'Details')]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="sheet-trigger"]') as HTMLButtonElement
    trigger.click()
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    expect(trigger.disabled).toBe(true)
    expect(seen).toEqual([])
  })
})
