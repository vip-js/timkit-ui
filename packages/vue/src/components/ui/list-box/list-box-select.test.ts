import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import ListBox from './list-box.vue'
import ListBoxItem from '../list-box-item/list-box-item.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const selected = (value: string) =>
  document.querySelector(`[data-slot="list-box-item"][data-value="${value}"]`)?.getAttribute('data-selected')

const show = async (disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(ListBox, { disabled }, () => [
        h(ListBoxItem, { value: 'apple' }, () => 'Apple'),
        h(ListBoxItem, { value: 'pear' }, () => 'Pear'),
        h(ListBoxItem, { value: 'plum', isDisabled: true }, () => 'Plum'),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const click = async (value: string) => {
  ;(document.querySelector(`[data-value="${value}"]`) as HTMLElement).click()
  await nextTick()
}

describe('vue list box selection', () => {
  it('follows a later value and keeps a disabled list on its current item', async () => {
    const value = ref('apple')
    const locked = ref<string | null>('apple')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = 'pear') }, 'Next'),
              h('button', { type: 'button', onClick: () => (locked.value = null) }, 'Clear'),
              h(ListBox, { modelValue: value.value }, () => [
                h(ListBoxItem, { value: 'apple' }, () => 'Apple'),
                h(ListBoxItem, { value: 'pear' }, () => 'Pear'),
                h(ListBoxItem, { value: 'plum', isDisabled: true }, () => 'Plum'),
              ]),
              h(ListBox, { disabled: true, modelValue: locked.value }, () => [
                h(ListBoxItem, { value: 'apple' }, () => 'Locked'),
                h(ListBoxItem, { value: 'pear' }, () => 'Other'),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const mark = (label: string) =>
      [...host.querySelectorAll('[data-slot="list-box-item"]')].find((item) => item.textContent?.includes(label))
    expect(mark('Apple')?.getAttribute('data-selected')).toBe('true')
    expect(mark('Pear')?.getAttribute('data-selected')).toBeNull()
    expect(mark('Locked')?.getAttribute('data-selected')).toBe('true')
    ;(mark('Other') as HTMLElement).click()
    ;(mark('Plum') as HTMLElement).click()
    await nextTick()
    expect(mark('Apple')?.getAttribute('data-selected')).toBe('true')
    expect(mark('Locked')?.getAttribute('data-selected')).toBe('true')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Next')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    press('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(mark('Apple')?.getAttribute('data-selected')).toBeNull()
    expect(mark('Pear')?.getAttribute('data-selected')).toBe('true')
    expect(mark('Locked')?.getAttribute('data-selected')).toBeNull()
  })

  it('selects one item, replaces it, and ignores a disabled item or list', async () => {
    await show()
    await click('apple')
    expect(selected('apple')).toBe('true')
    await click('pear')
    expect(selected('apple')).toBeNull()
    expect(selected('pear')).toBe('true')
    await click('plum')
    expect(selected('plum')).toBeNull()

    document.body.innerHTML = ''
    await show(true)
    await click('apple')
    expect(selected('apple')).toBeNull()
  })

  it('moves to the next enabled option with ArrowDown and selects it with Enter', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(ListBox, () => [
          h(ListBoxItem, { value: 'apple' }, () => 'Apple'),
          h(ListBoxItem, { value: 'plum', isDisabled: true }, () => 'Plum'),
          h(ListBoxItem, { value: 'pear' }, () => 'Pear'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const list = host.querySelector('[data-slot="list-box"]') as HTMLElement
    const highlighted = () => host.querySelector('[data-highlighted]')?.getAttribute('data-value')
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(highlighted()).toBe('apple')
    expect(selected('apple')).toBeNull()
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(highlighted()).toBe('pear')
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(selected('pear')).toBe('true')
  })

  it('moves the highlight with Home, End, and a letter without selecting', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(ListBox, () => [
            h(ListBoxItem, { value: 'apple', isDisabled: true }, () => 'Apple'),
            h(ListBoxItem, { value: 'pear' }, () => 'Pear'),
            h(ListBoxItem, { value: 'plum' }, () => 'Plum'),
            h(ListBoxItem, { value: 'peach' }, () => 'Peach'),
          ]),
          h(ListBox, { disabled: true }, () => [h(ListBoxItem, { value: 'pear' }, () => 'Pear')]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const lists = () => host.querySelectorAll('[data-slot="list-box"]')
    const highlighted = () => host.querySelector('[data-highlighted]')?.getAttribute('data-value')
    const press = async (key: string) => {
      ;(lists()[0] as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    await press('p')
    expect(highlighted()).toBe('pear')
    expect(selected('pear')).toBeNull()
    await press('p')
    expect(highlighted()).toBe('plum')
    await press('p')
    expect(highlighted()).toBe('peach')
    await press('z')
    expect(highlighted()).toBe('peach')
    await press('Home')
    expect(highlighted()).toBe('pear')
    await press('End')
    expect(highlighted()).toBe('peach')
    expect(selected('peach')).toBeNull()
    ;(lists()[1] as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
    await nextTick()
    expect(lists()[1]?.querySelector('[data-highlighted]')).toBeNull()
  })

  it('names an omitted list List and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(ListBox, () => h(ListBoxItem, { value: 'apple' }, () => 'Apple')),
          h(ListBox, { 'aria-label': 'Fruits' }, () => h(ListBoxItem, { value: 'pear' }, () => 'Pear')),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const labels = [...host.querySelectorAll('[data-slot="list-box"]')].map((node) => node.getAttribute('aria-label'))
    expect(labels).toEqual(['List', 'Fruits'])
  })
})
