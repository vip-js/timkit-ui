import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Accordion from './accordion.vue'
import AccordionContent from './accordion-content.vue'
import AccordionItem from './accordion-item.vue'
import AccordionTrigger from './accordion-trigger.vue'

const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = async (type: 'single' | 'multiple', disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(Accordion, { type, disabled }, () => [
        h(AccordionItem, { value: 'one' }, () => h(AccordionTrigger, null, () => 'One')),
        h(AccordionItem, { value: 'two' }, () => h(AccordionTrigger, null, () => 'Two')),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const press = async (name: string) => {
  const trigger = [...document.querySelectorAll('[data-slot="accordion-trigger"]')].find((item) =>
    item.textContent?.includes(name)
  ) as HTMLButtonElement
  trigger.focus()
  trigger.click()
  await nextTick()
}

const state = (name: string) => {
  const item = [...document.querySelectorAll('[data-slot="accordion-item"]')].find((entry) =>
    entry.textContent?.includes(name)
  )
  return item?.getAttribute('data-state')
}

describe('vue accordion type', () => {
  it('hides the marker beside a trigger', async () => {
    await show('single')
    const trigger = document.querySelector('[data-slot="accordion-trigger"]')
    expect(trigger?.textContent).toContain('One')
    expect(trigger?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('follows a later value and keeps a disabled accordion on its current item', async () => {
    const value = ref('one')
    const locked = ref('one')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = 'two') }, 'Next'),
              h('button', { type: 'button', onClick: () => (locked.value = '') }, 'Clear'),
              h(Accordion, { type: 'single', modelValue: value.value }, () => [
                h(AccordionItem, { value: 'one' }, () => h(AccordionTrigger, () => 'One')),
                h(AccordionItem, { value: 'two' }, () => h(AccordionTrigger, () => 'Two')),
              ]),
              h(Accordion, { type: 'single', disabled: true, modelValue: locked.value }, () => [
                h(AccordionItem, { value: 'one' }, () => h(AccordionTrigger, () => 'Locked')),
                h(AccordionItem, { value: 'two' }, () => h(AccordionTrigger, () => 'Other')),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(state('One')).toBe('open')
    expect(state('Two')).toBe('closed')
    expect(state('Locked')).toBe('open')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Item 1 of 2',
      'Item 1 of 2',
    ])
    await press('Other')
    expect(state('Locked')).toBe('open')
    expect(state('Other')).toBe('closed')
    const click = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    click('Next')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(state('One')).toBe('closed')
    expect(state('Two')).toBe('open')
    expect(state('Locked')).toBe('closed')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual(['Item 2 of 2'])
  })

  it('keeps one item open when type is single', async () => {
    await show('single')
    await press('One')
    await press('Two')
    expect(state('Two')).toBe('open')
    expect(state('One')).toBe('closed')
  })

  it('keeps every opened item when type is multiple', async () => {
    await show('multiple')
    await press('One')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 1 of 2')
    await press('Two')
    expect(state('One')).toBe('open')
    expect(state('Two')).toBe('open')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2 items open')
  })

  it('ignores opening while disabled', async () => {
    await show('single', true)
    await press('One')
    expect(state('One')).toBe('closed')
  })

  it('shows the open panel and keeps a disabled item closed', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Accordion, { type: 'single', defaultValue: ['one'] }, () => [
          h(AccordionItem, { value: 'one' }, () => [
            h(AccordionTrigger, () => 'One'),
            h(AccordionContent, () => 'Details'),
          ]),
          h(AccordionItem, { value: 'two', disabled: true }, () => [
            h(AccordionTrigger, () => 'Two'),
            h(AccordionContent, () => 'Hidden'),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const panel = (name: string) =>
      [...document.querySelectorAll('[data-slot="accordion-content"]')].find((node) =>
        node.textContent?.includes(name)
      )
    expect(panel('Details')?.hasAttribute('hidden')).toBe(false)
    expect(panel('Hidden')?.hasAttribute('hidden')).toBe(true)
    const trigger = (name: string) =>
      [...document.querySelectorAll('[data-slot="accordion-trigger"]')].find((node) =>
        node.textContent?.includes(name)
      )
    expect(trigger('One')?.getAttribute('aria-controls')).toBe(panel('Details')?.id)
    expect(panel('Details')?.getAttribute('role')).toBe('region')
    expect(panel('Details')?.getAttribute('aria-labelledby')).toBe(trigger('One')?.id)
    await press('Two')
    expect(panel('Hidden')?.hasAttribute('hidden')).toBe(true)
    expect(state('Two')).toBe('closed')
  })

  it('stays closed when the model is null even if the default is open', async () => {
    const seen: Array<string | string[]> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Accordion,
          {
            type: 'single',
            modelValue: null,
            defaultValue: ['one'],
            onValueChange: (value: string | string[]) => seen.push(value),
          },
          () =>
            h(AccordionItem, { value: 'one' }, () => [
              h(AccordionTrigger, () => 'One'),
              h(AccordionContent, () => 'Details'),
            ])
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const panel = () => document.querySelector('[data-slot="accordion-content"]')
    expect(panel()?.hasAttribute('hidden')).toBe(true)
    await press('One')
    expect(panel()?.hasAttribute('hidden')).toBe(true)
    expect(seen).toEqual(['one'])
  })

  it('keeps a single item open unless collapsing is allowed', async () => {
    await show('single')
    await press('One')
    await press('One')
    expect(state('One')).toBe('open')

    const first = mounted.at(-1)
    first?.unmount()
    first?.host.remove()
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Accordion, { type: 'single', collapsible: true }, () =>
          h(AccordionItem, { value: 'one' }, () => h(AccordionTrigger, () => 'One'))
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await press('One')
    await press('One')
    expect(state('One')).toBe('closed')
  })

  it('moves to the next trigger with ArrowDown without opening it', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Accordion, { type: 'single' }, () => [
          h(AccordionItem, { value: 'one' }, () => h(AccordionTrigger, () => 'One')),
          h(AccordionItem, { value: 'locked', disabled: true }, () => h(AccordionTrigger, () => 'Locked')),
          h(AccordionItem, { value: 'two' }, () => h(AccordionTrigger, () => 'Two')),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (name: string) =>
      [...document.querySelectorAll('[data-slot="accordion-trigger"]')].find((item) =>
        item.textContent?.includes(name)
      ) as HTMLButtonElement
    trigger('One').focus()
    trigger('One').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(trigger('Two'))
    expect(state('One')).toBe('closed')
    expect(state('Two')).toBe('closed')
  })

  it('moves to the first and last enabled trigger with Home and End without opening them', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Accordion, { type: 'single' }, () => [
          h(AccordionItem, { value: 'one' }, () => h(AccordionTrigger, () => 'One')),
          h(AccordionItem, { value: 'locked', disabled: true }, () => h(AccordionTrigger, () => 'Locked')),
          h(AccordionItem, { value: 'three' }, () => h(AccordionTrigger, () => 'Three')),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (name: string) =>
      [...document.querySelectorAll('[data-slot="accordion-trigger"]')].find((item) =>
        item.textContent?.includes(name)
      ) as HTMLButtonElement
    trigger('One').focus()
    trigger('One').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(trigger('Three'))
    expect(state('One')).toBe('closed')
    expect(state('Three')).toBe('closed')
    trigger('Three').dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(trigger('One'))
    expect(state('One')).toBe('closed')
  })
})
