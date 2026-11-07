import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Combobox from './combobox.vue'
import ComboboxContent from './combobox-content.vue'
import ComboboxEmpty from './combobox-empty.vue'
import ComboboxInput from './combobox-input.vue'
import ComboboxItem from './combobox-item.vue'
import ComboboxLabel from './combobox-label.vue'

const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}
Element.prototype.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

const pear = { label: 'Pear', value: 'pear' }
const apple = { label: 'Apple', value: 'apple', disabled: true }
const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const press = async (index: number, key: string) => {
  const input = document.querySelectorAll('[data-slot="combobox-input"]')[index] as HTMLInputElement & {
    __vueParentComponent?: { subTree?: { props?: Record<string, unknown> } }
  }
  const props = input.__vueParentComponent?.subTree?.props ?? {}
  const handler = props.onKeydown ?? props.onKeyDown ?? props.onkeydown
  if (typeof handler !== 'function') throw new Error(Object.keys(props).sort().join(','))
  input.focus()
  const focus = props.onFocus
  if (typeof focus === 'function') focus(new FocusEvent('focus'))
  handler(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
  await nextTick()
}

const typeQuery = async (text: string) => {
  const input = document.querySelector('[data-slot="combobox-input"]') as HTMLInputElement & {
    __vueParentComponent?: { subTree?: { props?: Record<string, unknown> } }
  }
  input.value = text
  const props = input.__vueParentComponent?.subTree?.props ?? {}
  const handler = props.onInput ?? props.onChange ?? props.oninput
  if (typeof handler !== 'function') throw new Error(Object.keys(props).sort().join(','))
  handler({ currentTarget: input, target: input, value: text })
  await nextTick()
}

const plainApple = { label: 'Apple', value: 'apple' }

describe('vue combobox selection', () => {
  it('follows a later value', async () => {
    const value = ref(['apple'])
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    value.value = ['pear']
                  },
                },
                'Replace'
              ),
              h(Combobox, { items: [plainApple, pear], value: value.value }, () => h(ComboboxInput)),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = () => host.querySelector('[data-slot="combobox-input"]') as HTMLInputElement
    expect(input().getAttribute('aria-label')).toBe('Choose an item')
    expect(input().value).toMatch(/apple/i)
    document.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    expect(input().value).toMatch(/pear/i)
    expect(input().value).not.toMatch(/apple/i)
  })

  it('selects an enabled item and ignores a disabled item or a disabled field', async () => {
    const seen: string[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(
          Combobox,
          { items: [pear, apple], onValueChange: (value: string[]) => seen.push(value) },
          () => [
            h(ComboboxInput),
            h(ComboboxContent, () => [h(ComboboxItem, { item: pear }, () => 'Pear'), h(ComboboxItem, { item: apple }, () => 'Apple')]),
          ]
        ),
        h(Combobox, { disabled: true, items: [pear] }, () => [
          h(ComboboxInput),
          h(ComboboxContent, () => [h(ComboboxItem, { item: pear }, () => 'Locked')]),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await press(0, 'ArrowDown')
    expect(document.body.textContent).toContain('Pear')
    await press(0, 'Enter')
    expect(seen).toEqual([['pear']])
    await press(0, 'ArrowDown')
    await press(0, 'Enter')
    expect(seen.flat()).not.toContain('apple')
    await press(1, 'ArrowDown')
    expect(document.body.textContent).not.toContain('Locked')
  })

  it('ignores selection while read-only', async () => {
    const seen: string[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Combobox, { readOnly: true, items: [pear], onValueChange: (value: string[]) => seen.push(value) }, () => [
          h(ComboboxInput),
          h(ComboboxContent, () => h(ComboboxItem, { item: pear }, () => 'Pear')),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await press(0, 'ArrowDown')
    await press(0, 'Enter')
    const input = host.querySelector('[data-slot="combobox-input"]') as HTMLInputElement
    expect(input.value).not.toMatch(/pear/i)
    expect(seen).toEqual([])
  })

  it('stays empty when value is null even if the default is pear', async () => {
    const seen: string[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Combobox,
          {
            items: [pear],
            value: null,
            defaultValue: ['pear'],
            onValueChange: (value: string[]) => seen.push(value),
          },
          () => [h(ComboboxInput), h(ComboboxContent, () => h(ComboboxItem, { item: pear }, () => 'Pear'))]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = () => document.querySelector('[data-slot="combobox-input"]') as HTMLInputElement
    expect(input().value).not.toMatch(/pear/i)
    await press(0, 'ArrowDown')
    await press(0, 'Enter')
    expect(input().value).not.toMatch(/pear/i)
    expect(seen).toEqual([['pear']])
  })

  it('filters the list and shows the empty state when nothing matches', async () => {
    const seen: string[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Combobox, { items: [plainApple, pear], onValueChange: (value: string[]) => seen.push(value) }, () => [
          h(ComboboxInput),
          h(ComboboxContent, () => [
            h(ComboboxItem, { item: plainApple }, () => 'Apple'),
            h(ComboboxItem, { item: pear }, () => 'Pear'),
            h(ComboboxEmpty, () => 'No results'),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await press(0, 'ArrowDown')
    expect(host.textContent).toContain('Apple')
    expect(host.textContent).toContain('Pear')
    expect(host.querySelector('[role="status"]')).toBeNull()
    await typeQuery('pea')
    expect(host.textContent).toContain('Pear')
    expect(host.textContent).not.toContain('Apple')
    expect(host.querySelector('[role="status"]')).toBeNull()
    await press(0, 'ArrowDown')
    await press(0, 'Enter')
    expect(seen).toEqual([['pear']])
    await typeQuery('zzz')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('No results')
    expect(host.textContent).not.toContain('Apple')
    expect(host.textContent).not.toContain('Pear')
  })

  it('uses the visible label instead of the fallback name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Combobox, { items: [plainApple] }, () => [h(ComboboxLabel, () => 'Fruit'), h(ComboboxInput)]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = host.querySelector('[data-slot="combobox-input"]') as HTMLInputElement
    const label = host.querySelector('label') as HTMLLabelElement
    expect(label.textContent).toBe('Fruit')
    expect(label.htmlFor).toBe(input.id)
    expect(input.getAttribute('aria-label')).toBeNull()
  })

  it('jumps to the first and last enabled item with Home and End without selecting them', async () => {
    const plum = { label: 'Plum', value: 'plum' }
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Combobox, { items: [apple, pear, plum] }, () => [
          h(ComboboxInput),
          h(ComboboxContent, () => [
            h(ComboboxItem, { item: apple }, () => 'Apple'),
            h(ComboboxItem, { item: pear }, () => 'Pear'),
            h(ComboboxItem, { item: plum }, () => 'Plum'),
          ]),
        ]),
        h(Combobox, { items: [apple, pear, plum], readOnly: true }, () => [
          h(ComboboxInput),
          h(ComboboxContent, () => [h(ComboboxItem, { item: pear }, () => 'Pear')]),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const highlighted = () => document.querySelector('[data-highlighted]')?.textContent ?? ''
    const input = () => document.querySelectorAll('[data-slot="combobox-input"]')[0] as HTMLInputElement
    await press(0, 'ArrowDown')
    await press(0, 'End')
    await Promise.resolve()
    expect(highlighted()).toContain('Plum')
    await press(0, 'Home')
    await Promise.resolve()
    expect(highlighted()).toContain('Pear')
    expect(highlighted()).not.toContain('Apple')
    expect(input().value).toBe('')
    await press(1, 'Home')
    const frozen = document.querySelectorAll('[data-slot="combobox-input"]')[1] as HTMLInputElement
    expect(frozen.getAttribute('aria-expanded')).not.toBe('true')
    expect(frozen.value).toBe('')
  })
})
