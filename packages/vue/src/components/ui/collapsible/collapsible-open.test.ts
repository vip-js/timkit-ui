import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Collapsible from './collapsible.vue'
import CollapsibleContent from './collapsible-content.vue'
import CollapsibleTrigger from './collapsible-trigger.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue collapsible open', () => {
  it('follows a later open value and keeps a disabled trigger closed', async () => {
    const open = ref(false)
    const locked = ref(false)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (open.value = true) }, 'Open'),
              h('button', { type: 'button', onClick: () => (locked.value = true) }, 'Unlock'),
              h(Collapsible, { open: open.value }, () => [
                h(CollapsibleTrigger, () => 'Details'),
                h(CollapsibleContent, () => 'Body'),
              ]),
              h(Collapsible, { disabled: true, open: locked.value }, () => [
                h(CollapsibleTrigger, () => 'Locked'),
                h(CollapsibleContent, () => 'Hidden'),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (index: number) =>
      host.querySelectorAll('[data-slot="collapsible-trigger"]')[index] as HTMLButtonElement
    const content = (index: number) =>
      host.querySelectorAll('[data-slot="collapsible-content"]')[index] as HTMLElement
    expect(content(0).hidden).toBe(true)
    expect(content(1).hidden).toBe(true)
    expect(host.querySelector('[role="status"]')).toBeNull()
    trigger(1).click()
    await nextTick()
    expect(content(1).hidden).toBe(true)
    const click = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    click('Open')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('Unlock')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    expect(content(0).hidden).toBe(false)
    expect(content(0).textContent).toContain('Body')
    expect(host.querySelectorAll('[role="status"]')).toHaveLength(2)
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Opened')
    expect(content(1).hidden).toBe(false)
    expect(content(1).textContent).toContain('Hidden')
  })

  it('opens from the trigger and ignores a disabled trigger', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Collapsible, { onOpenChange: (open: boolean) => seen.push(open) }, () => [
            h(CollapsibleTrigger, () => 'Details'),
            h(CollapsibleContent, () => 'Body'),
          ]),
          h(Collapsible, { disabled: true }, () => [
            h(CollapsibleTrigger, () => 'Locked'),
            h(CollapsibleContent, () => 'Hidden'),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (index: number) => document.querySelectorAll('[data-slot="collapsible-trigger"]')[index] as HTMLButtonElement
    const content = (index: number) => document.querySelectorAll('[data-slot="collapsible-content"]')[index] as HTMLElement
    expect(trigger(0).getAttribute('data-state')).toBe('closed')
    expect(content(0).hidden).toBe(true)
    trigger(0).click()
    await nextTick()
    expect(trigger(0).getAttribute('data-state')).toBe('open')
    expect(trigger(0).getAttribute('aria-expanded')).toBe('true')
    expect(content(0).hidden).toBe(false)
    expect(content(0).textContent).toContain('Body')
    expect(trigger(0).getAttribute('aria-controls')).toBe(content(0).id)
    expect(content(0).getAttribute('role')).toBe('region')
    expect(content(0).getAttribute('aria-labelledby')).toBe(trigger(0).id)
    expect(seen).toEqual([true])
    trigger(1).click()
    await nextTick()
    expect(trigger(1).getAttribute('data-state')).toBe('closed')
    expect(content(1).hidden).toBe(true)
    expect(seen).toEqual([true])
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Collapsible, { open: null, defaultOpen: true, onOpenChange: (open: boolean) => seen.push(open) }, () => [
          h(CollapsibleTrigger, () => 'Details'),
          h(CollapsibleContent, () => 'Body'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = host.querySelector('[data-slot="collapsible-trigger"]') as HTMLButtonElement
    const content = host.querySelector('[data-slot="collapsible-content"]') as HTMLElement
    expect(content.hidden).toBe(true)
    trigger.click()
    await nextTick()
    expect(content.hidden).toBe(true)
    expect(seen).toEqual([true])
  })
})
