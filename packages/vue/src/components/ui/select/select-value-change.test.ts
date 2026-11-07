import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Select from './select.vue'
import SelectContent from './select-content.vue'
import SelectItem from './select-item.vue'
import SelectTrigger from './select-trigger.vue'
import SelectValue from './select-value.vue'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
Element.prototype.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const item = (label: string) =>
  [...document.querySelectorAll('[data-slot="select-item"]')].find((node) => node.textContent?.includes(label)) as HTMLElement

describe('vue select value', () => {
  it('follows a later value and keeps a disabled field closed', async () => {
    const value = ref('pear')
    const locked = ref('pear')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () => [
            h('button', { type: 'button', onClick: () => (value.value = 'plum') }, 'Next'),
            h('button', { type: 'button', onClick: () => (locked.value = '') }, 'Clear'),
            h(Select, { value: value.value }, () => [
              h(SelectTrigger, () => h(SelectValue)),
              h(SelectContent, () => [h(SelectItem, { value: 'pear' }, () => 'Pear'), h(SelectItem, { value: 'plum' }, () => 'Plum')]),
            ]),
            h(Select, { disabled: true, value: locked.value }, () => [
              h(SelectTrigger, () => h(SelectValue)),
              h(SelectContent, () => h(SelectItem, { value: 'pear' }, () => 'Pear')),
            ]),
          ]
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const triggers = () => host.querySelectorAll('[data-slot="select-trigger"]')
    expect(triggers()[0]?.textContent).toContain('Pear')
    expect(triggers()[1]?.textContent).toContain('Pear')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Option 1 of 2',
      'Option 1 of 1',
    ])
    ;(triggers()[1] as HTMLButtonElement).click()
    await nextTick()
    expect(triggers()[1]?.getAttribute('aria-expanded')).not.toBe('true')
    const click = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    click('Next')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(triggers()[0]?.textContent).toContain('Plum')
    expect(triggers()[1]?.textContent).not.toContain('Pear')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual(['Option 2 of 2'])
  })

  it('opens, selects an item, and ignores a disabled item or a disabled field', async () => {
    const seen: Array<string | undefined> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Select, { onChange: (value?: string) => seen.push(value) }, () => [
          h(SelectTrigger, () => h(SelectValue, { placeholder: 'Pick' })),
          h(SelectContent, () => [h(SelectItem, { value: 'pear' }, () => 'Pear'), h(SelectItem, { value: 'apple', disabled: true }, () => 'Apple')]),
        ]),
        h(Select, { disabled: true }, () => [
          h(SelectTrigger, () => h(SelectValue, { placeholder: 'Locked' })),
          h(SelectContent, () => h(SelectItem, { value: 'pear' }, () => 'Hidden')),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const triggers = () => document.querySelectorAll('[data-slot="select-trigger"]')
    expect(triggers()[0]?.textContent).toContain('Pick')
    ;(triggers()[0] as HTMLButtonElement).click()
    await nextTick()
    item('Pear').click()
    await nextTick()
    expect(triggers()[0]?.textContent).toContain('Pear')
    item('Apple').click()
    await nextTick()
    expect(seen).toEqual(['pear'])
    ;(triggers()[1] as HTMLButtonElement).click()
    await nextTick()
    expect(triggers()[1]?.getAttribute('aria-expanded')).not.toBe('true')
    expect(triggers()[1]?.textContent).toContain('Locked')
    expect(triggers()[1]?.textContent).not.toContain('Hidden')
  })

  it('stays empty when the model is null even if the default is pear', async () => {
    const seen: Array<string | undefined> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Select,
          { modelValue: null, defaultValue: 'pear', onChange: (value?: string) => seen.push(value) },
          () => [
            h(SelectTrigger, () => h(SelectValue, { placeholder: 'Pick' })),
            h(SelectContent, () => h(SelectItem, { value: 'pear' }, () => 'Pear')),
          ]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    expect(trigger.textContent).not.toContain('Pear')
    trigger.click()
    await nextTick()
    item('Pear').click()
    await nextTick()
    expect(trigger.textContent).not.toContain('Pear')
    expect(seen).toEqual(['pear'])
  })

  it('ignores opening while the select is read-only', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Select, { readOnly: true, defaultValue: 'apple' }, () => [
          h(SelectTrigger, () => h(SelectValue, { placeholder: 'Locked' })),
          h(SelectContent, () => h(SelectItem, { value: 'pear' }, () => 'Pear')),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    trigger.click()
    await nextTick()
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    item('Pear').click()
    await nextTick()
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    expect(trigger.textContent).not.toContain('Pear')
  })

  it('jumps to the first and last enabled option with Home and End', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Select, () => [
          h(SelectTrigger, () => h(SelectValue, { placeholder: 'Pick' })),
          h(SelectContent, () => [
            h(SelectItem, { value: 'pear' }, () => 'Pear'),
            h(SelectItem, { value: 'apple', disabled: true }, () => 'Apple'),
            h(SelectItem, { value: 'plum' }, () => 'Plum'),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    trigger.click()
    await nextTick()
    const list = document.querySelector('[role="listbox"]') as HTMLElement
    const highlighted = () =>
      document.querySelector('[data-slot="select-item"][data-highlighted]')?.getAttribute('data-value')
    const press = async (key: string) => {
      list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    await press('End')
    expect(highlighted()).toBe('plum')
    await press('Home')
    expect(highlighted()).toBe('pear')
    expect(trigger.textContent).not.toContain('Plum')
    expect(trigger.textContent).not.toContain('Pear')
  })

  it('moves to the next matching option with a letter and selects it only while closed', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Select, () => [
            h(SelectTrigger, () => h(SelectValue, { placeholder: 'Pick' })),
            h(SelectContent, () => [
              h(SelectItem, { value: 'pear' }, () => 'Pear'),
              h(SelectItem, { value: 'apple', disabled: true }, () => 'Apple'),
              h(SelectItem, { value: 'plum' }, () => 'Plum'),
              h(SelectItem, { value: 'peach' }, () => 'Peach'),
            ]),
          ]),
          h(Select, () => [
            h(SelectTrigger, () => h(SelectValue, { placeholder: 'Closed' })),
            h(SelectContent, () => [
              h(SelectItem, { value: 'pear' }, () => 'Pear'),
              h(SelectItem, { value: 'apple', disabled: true }, () => 'Apple'),
              h(SelectItem, { value: 'plum' }, () => 'Plum'),
              h(SelectItem, { value: 'peach' }, () => 'Peach'),
            ]),
          ]),
          h(Select, { readOnly: true }, () => [
            h(SelectTrigger, () => h(SelectValue, { placeholder: 'Frozen' })),
            h(SelectContent, () => h(SelectItem, { value: 'pear' }, () => 'Pear')),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const triggers = () => document.querySelectorAll('[data-slot="select-trigger"]')
    const highlighted = () =>
      document.querySelector('[data-slot="select-item"][data-highlighted]')?.getAttribute('data-value')
    ;(triggers()[0] as HTMLButtonElement).click()
    await nextTick()
    const list = document.querySelector('[role="listbox"]') as HTMLElement
    const pressList = async (key: string) => {
      list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    await pressList('p')
    expect(highlighted()).toBe('pear')
    await pressList('p')
    expect(highlighted()).toBe('plum')
    await pressList('p')
    expect(highlighted()).toBe('peach')
    await pressList('z')
    expect(highlighted()).toBe('peach')
    expect(triggers()[0]?.textContent).toContain('Pick')
    const pressTrigger = async (index: number, key: string) => {
      const trigger = triggers()[index] as HTMLButtonElement
      trigger.focus()
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    await pressTrigger(1, 'p')
    expect(triggers()[1]?.textContent).toContain('Pear')
    expect(triggers()[1]?.getAttribute('aria-expanded')).not.toBe('true')
    await pressTrigger(1, 'p')
    expect(triggers()[1]?.textContent).toContain('Plum')
    await pressTrigger(2, 'p')
    expect(triggers()[2]?.textContent).toContain('Frozen')
  })

  it('selects the first and last enabled option with Home and End while closed', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Select, () => [
            h(SelectTrigger, () => h(SelectValue, { placeholder: 'Pick' })),
            h(SelectContent, () => [
              h(SelectItem, { value: 'apple', disabled: true }, () => 'Apple'),
              h(SelectItem, { value: 'pear' }, () => 'Pear'),
              h(SelectItem, { value: 'plum' }, () => 'Plum'),
            ]),
          ]),
          h(Select, { readOnly: true }, () => [
            h(SelectTrigger, () => h(SelectValue, { placeholder: 'Frozen' })),
            h(SelectContent, () => [h(SelectItem, { value: 'pear' }, () => 'Pear')]),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const triggers = () => host.querySelectorAll('[data-slot="select-trigger"]')
    const press = async (index: number, key: string) => {
      const trigger = triggers()[index] as HTMLButtonElement
      trigger.focus()
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    await press(0, 'Home')
    expect(triggers()[0]?.textContent).toContain('Pear')
    expect(triggers()[0]?.getAttribute('aria-expanded')).not.toBe('true')
    await press(0, 'End')
    expect(triggers()[0]?.textContent).toContain('Plum')
    expect(triggers()[0]?.getAttribute('aria-expanded')).not.toBe('true')
    await press(1, 'End')
    expect(triggers()[1]?.textContent).toContain('Frozen')
  })
})
