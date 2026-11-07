import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import ToggleGroup from './toggle-group.vue'
import ToggleGroupItem from './toggle-group-item.vue'

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

const show = async (type: 'single' | 'multiple') => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(ToggleGroup, { type }, () => [
        h(ToggleGroupItem, { value: 'bold' }, () => 'Bold'),
        h(ToggleGroupItem, { value: 'italic' }, () => 'Italic'),
      ]),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const button = (name: string) =>
  [...document.querySelectorAll('[data-slot="toggle-group-item"]')].find((item) =>
    item.textContent?.includes(name)
  ) as HTMLButtonElement

const press = async (name: string) => {
  button(name).click()
  await nextTick()
}

const state = (name: string) => button(name).getAttribute('data-state')

describe('vue toggle group type', () => {
  it('follows a later value and keeps a disabled group on its current item', async () => {
    const value = ref('bold')
    const locked = ref('bold')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = 'italic') }, 'Next'),
              h('button', { type: 'button', onClick: () => (locked.value = '') }, 'Clear'),
              h(ToggleGroup, { type: 'single', modelValue: value.value }, () => [
                h(ToggleGroupItem, { value: 'bold' }, () => 'Bold'),
                h(ToggleGroupItem, { value: 'italic' }, () => 'Italic'),
              ]),
              h(ToggleGroup, { type: 'single', disabled: true, modelValue: locked.value }, () => [
                h(ToggleGroupItem, { value: 'bold' }, () => 'Locked'),
                h(ToggleGroupItem, { value: 'italic' }, () => 'Other'),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(state('Bold')).toBe('on')
    expect(state('Italic')).toBe('off')
    expect(state('Locked')).toBe('on')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Item 1 of 2',
      'Item 1 of 2',
    ])
    await press('Other')
    expect(state('Locked')).toBe('on')
    expect(state('Other')).toBe('off')
    const click = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    click('Next')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(state('Bold')).toBe('off')
    expect(state('Italic')).toBe('on')
    expect(state('Locked')).toBe('off')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual(['Item 2 of 2'])
  })

  it('keeps one item pressed when type is single', async () => {
    await show('single')
    await press('Bold')
    expect(state('Bold')).toBe('on')
    await press('Italic')
    expect(state('Italic')).toBe('on')
    expect(state('Bold')).toBe('off')
  })

  it('ignores a disabled item and a disabled group', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(ToggleGroup, { type: 'single' }, () => [
          h(ToggleGroupItem, { value: 'bold' }, () => 'Bold'),
          h(ToggleGroupItem, { value: 'italic', disabled: true }, () => 'Italic'),
        ]),
        h(ToggleGroup, { type: 'single', disabled: true }, () => [
          h(ToggleGroupItem, { value: 'bold' }, () => 'Locked'),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    button('Italic').click()
    await nextTick()
    expect(state('Italic')).toBe('off')
    expect(state('Bold')).toBe('off')
    button('Locked').click()
    await nextTick()
    expect(state('Locked')).toBe('off')
  })

  it('keeps every pressed item when type is multiple', async () => {
    await show('multiple')
    await press('Bold')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 1 of 2')
    await press('Italic')
    expect(state('Bold')).toBe('on')
    expect(state('Italic')).toBe('on')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2 items pressed')
  })

  it('stays off when the model is null even if the default is bold', async () => {
    const seen: Array<string | string[]> = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          ToggleGroup,
          {
            type: 'single',
            modelValue: null,
            defaultValue: 'bold',
            onChange: (value: string | string[]) => seen.push(value),
          },
          () => [
            h(ToggleGroupItem, { value: 'bold' }, () => 'Bold'),
            h(ToggleGroupItem, { value: 'italic' }, () => 'Italic'),
          ]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(state('Bold')).toBe('off')
    expect(state('Italic')).toBe('off')
    await press('Italic')
    expect(state('Bold')).toBe('off')
    expect(state('Italic')).toBe('off')
    expect(seen).toEqual(['italic'])
  })

  it('moves to the next enabled item with ArrowRight without pressing it', async () => {
    const real = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
      callback(0)
      return 0
    }
    try {
      const host = document.createElement('div')
      document.body.append(host)
      const app = createApp({
        render: () =>
          h(ToggleGroup, { type: 'single' }, () => [
            h(ToggleGroupItem, { value: 'bold' }, () => 'Bold'),
            h(ToggleGroupItem, { value: 'locked', disabled: true }, () => 'Locked'),
            h(ToggleGroupItem, { value: 'italic' }, () => 'Italic'),
          ]),
      })
      app.mount(host)
      mounted.push({ unmount: () => app.unmount(), host })
      await nextTick()
      expect(host.querySelector('[data-slot="toggle-group"]')?.getAttribute('role')).toBe('radiogroup')
      const bold = button('Bold')
      bold.focus()
      await nextTick()
      const key = async (target: HTMLElement, name: string) => {
        target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }))
        await nextTick()
      }
      await key(bold, 'ArrowRight')
      expect(document.activeElement).toBe(button('Italic'))
      expect(state('Bold')).toBe('off')
      expect(state('Locked')).toBe('off')
      expect(state('Italic')).toBe('off')
      expect(button('Bold').tabIndex).toBe(-1)
      expect(button('Italic').tabIndex).toBe(0)
      await key(button('Italic'), 'ArrowRight')
      expect(document.activeElement).toBe(button('Bold'))
      expect(state('Bold')).toBe('off')
    } finally {
      globalThis.requestAnimationFrame = real
    }
  })

  it('names an omitted group Toggle group and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(ToggleGroup, { type: 'single' }, () => h(ToggleGroupItem, { value: 'bold' }, () => 'Bold')),
          h(ToggleGroup, { type: 'multiple', 'aria-label': 'Format' }, () =>
            h(ToggleGroupItem, { value: 'bold' }, () => 'Bold')
          ),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const labels = [...host.querySelectorAll('[data-slot="toggle-group"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Toggle group', 'Format'])
  })
})
