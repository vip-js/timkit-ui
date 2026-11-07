import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import DropdownMenu from './dropdown-menu.vue'
import DropdownMenuCheckboxItem from './dropdown-menu-checkbox-item.vue'
import DropdownMenuContent from './dropdown-menu-content.vue'
import DropdownMenuItem from './dropdown-menu-item.vue'
import DropdownMenuRadioGroup from './dropdown-menu-radio-group.vue'
import DropdownMenuRadioItem from './dropdown-menu-radio-item.vue'
import DropdownMenuShortcut from './dropdown-menu-shortcut.vue'
import DropdownMenuTrigger from './dropdown-menu-trigger.vue'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
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

describe('vue dropdown menu selection', () => {
  it('follows a later open value and ignores a disabled trigger', async () => {
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
            h(DropdownMenu, { open: open.value }, () => [
              h(DropdownMenuTrigger, () => 'Open'),
              h(DropdownMenuContent, () => 'Details'),
            ]),
            h(DropdownMenu, { open: locked.value }, () => [
              h(DropdownMenuTrigger, { disabled: true }, () => 'Locked'),
              h(DropdownMenuContent, () => 'Hidden'),
            ]),
          ]
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="dropdown-menu-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    expect(document.body.textContent).not.toContain('Hidden')
    trigger('Locked').click()
    await nextTick()
    expect(document.body.textContent).not.toContain('Hidden')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Show')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    press('Unlock')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    await Promise.resolve()
    expect(document.body.textContent).toContain('Details')
    expect(document.body.textContent).toContain('Hidden')
    const menu = [...document.querySelectorAll('[role="menu"]')].find((node) => node.textContent?.includes('Details'))
    expect(menu?.getAttribute('aria-labelledby')).toBe(trigger('Open').id)
    expect(trigger('Open').getAttribute('aria-controls')).toBe(menu?.id)
    expect(trigger('Open').getAttribute('aria-haspopup')).toBe('menu')
  })

  it('toggles a checkbox, replaces a radio, and ignores disabled items', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DropdownMenu, { defaultOpen: true, closeOnSelect: false }, () =>
          h(DropdownMenuContent, () => [
            h(DropdownMenuCheckboxItem, () => 'Bold'),
            h(DropdownMenuCheckboxItem, { disabled: true }, () => 'Italic'),
            h(DropdownMenuRadioGroup, () => [
              h(DropdownMenuRadioItem, { value: 'apple' }, () => 'Apple'),
              h(DropdownMenuRadioItem, { value: 'pear' }, () => 'Pear'),
              h(DropdownMenuRadioItem, { value: 'plum', disabled: true }, () => 'Plum'),
            ]),
          ])
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const boxes = () => document.querySelectorAll('[data-slot="dropdown-menu-checkbox-item"]')
    const radios = () => document.querySelectorAll('[data-slot="dropdown-menu-radio-item"]')
    const press = (node: Element) => {
      ;(node as HTMLElement).click()
    }
    press(boxes()[0])
    await nextTick()
    expect(boxes()[0]?.getAttribute('data-state')).toBe('checked')
    press(boxes()[1])
    await nextTick()
    expect(boxes()[1]?.getAttribute('data-state')).not.toBe('checked')
    press(radios()[0])
    await nextTick()
    expect(radios()[0]?.getAttribute('data-state')).toBe('checked')
    press(radios()[1])
    press(radios()[2])
    await nextTick()
    expect(radios()[0]?.getAttribute('data-state')).not.toBe('checked')
    expect(radios()[1]?.getAttribute('data-state')).toBe('checked')
    expect(radios()[2]?.getAttribute('data-state')).not.toBe('checked')
  })

  it('stays empty when the model is null even if the default is apple', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DropdownMenu, { defaultOpen: true }, () =>
          h(DropdownMenuContent, () =>
            h(
              DropdownMenuRadioGroup,
              {
                modelValue: null,
                defaultValue: 'apple',
                'onUpdate:modelValue': (value: string) => seen.push(value),
              },
              () => [
                h(DropdownMenuRadioItem, { value: 'apple' }, () => 'Apple'),
                h(DropdownMenuRadioItem, { value: 'pear' }, () => 'Pear'),
              ]
            )
          )
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const radios = () => document.querySelectorAll('[data-slot="dropdown-menu-radio-item"]')
    expect(radios()[0]?.getAttribute('data-state')).not.toBe('checked')
    expect(radios()[1]?.getAttribute('data-state')).not.toBe('checked')
    ;(radios()[1] as HTMLElement).click()
    await nextTick()
    expect(radios()[0]?.getAttribute('data-state')).not.toBe('checked')
    expect(radios()[1]?.getAttribute('data-state')).not.toBe('checked')
    expect(seen).toEqual(['pear'])
  })

  it('stays unchecked when checked is null and a click only requests a check', async () => {
    const checked = ref<boolean | null>(true)
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h(DropdownMenu, { defaultOpen: true, closeOnSelect: false }, () => [
              h('button', { type: 'button', onClick: () => (checked.value = null) }, 'Clear'),
              h(DropdownMenuContent, () =>
                h(
                  DropdownMenuCheckboxItem,
                  {
                    checked: checked.value,
                    onCheckedChange: (next: boolean) => seen.push(next),
                  },
                  () => 'Bold'
                )
              ),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const box = () => document.querySelector('[data-slot="dropdown-menu-checkbox-item"]')
    expect(box()?.getAttribute('data-state')).toBe('checked')
    ;[...host.querySelectorAll('button')].find((button) => button.textContent === 'Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(box()?.getAttribute('data-state')).toBe('unchecked')
    ;(box() as HTMLElement).click()
    await nextTick()
    expect(box()?.getAttribute('data-state')).toBe('unchecked')
    expect(seen).toEqual([true])
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(DropdownMenu, { open: null, defaultOpen: true, onOpenChange: (open: boolean) => seen.push(open) }, () => [
          h(DropdownMenuTrigger, () => 'Open'),
          h(DropdownMenuContent, () => 'Details'),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    ;(document.querySelector('[data-slot="dropdown-menu-trigger"]') as HTMLButtonElement).click()
    await nextTick()
    expect(document.body.textContent).not.toContain('Details')
    expect(seen.at(-1)).toBe(true)
  })

  it('ignores opening and selection while the menu is disabled', async () => {
    const opened: boolean[] = []
    const selected: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(DropdownMenu, { disabled: true, onOpenChange: (open: boolean) => opened.push(open) }, () => [
          h(DropdownMenuTrigger, () => 'Open'),
          h(DropdownMenuContent, () => 'Details'),
        ]),
        h(DropdownMenu, { defaultOpen: true, disabled: true }, () => [
          h(DropdownMenuTrigger, () => 'Menu'),
          h(DropdownMenuContent, () =>
            h(DropdownMenuItem, { value: 'save', onSelect: () => selected.push('save') }, () => 'Save')
          ),
        ]),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const trigger = host.querySelector('[data-slot="dropdown-menu-trigger"]') as HTMLButtonElement
    trigger.click()
    await nextTick()
    expect(host.textContent).not.toContain('Details')
    expect(trigger.disabled).toBe(true)
    expect(opened).toEqual([])
    const item = [...document.querySelectorAll('[data-slot="dropdown-menu-item"]')].find((node) =>
      node.textContent?.includes('Save')
    ) as HTMLElement
    item.click()
    await nextTick()
    expect(selected).toEqual([])
  })

  it('jumps to the first and last enabled item with Home and End without selecting them', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(DropdownMenu, { defaultOpen: true }, () => [
            h(DropdownMenuTrigger, () => 'Open'),
            h(DropdownMenuContent, () => [
              h(DropdownMenuItem, { value: 'pear' }, () => 'Pear'),
              h(DropdownMenuItem, { value: 'apple', disabled: true }, () => 'Apple'),
              h(DropdownMenuItem, { value: 'plum' }, () => 'Plum'),
            ]),
          ]),
          h(DropdownMenu, () => [
            h(DropdownMenuTrigger, () => 'Closed'),
            h(DropdownMenuContent, () => h(DropdownMenuItem, { value: 'pear' }, () => 'Pear')),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const menus = () => document.querySelectorAll('[data-slot="dropdown-menu-content"]')
    const highlighted = () => document.querySelector('[data-slot="dropdown-menu-item"][data-highlighted]')?.textContent
    const menu = menus()[0] as HTMLElement
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await nextTick()
    await Promise.resolve()
    expect(highlighted()).toContain('Plum')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 3 of 3')
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    await nextTick()
    await Promise.resolve()
    expect(highlighted()).toContain('Pear')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 1 of 3')
    expect(menus()).toHaveLength(1)
    const closed = [...document.querySelectorAll('[data-slot="dropdown-menu-trigger"]')].find((node) =>
      node.textContent?.includes('Closed')
    ) as HTMLButtonElement
    closed.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    await nextTick()
    expect(menus()).toHaveLength(1)
  })

  it('moves to the next enabled item whose label starts with a letter without selecting it', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(DropdownMenu, { defaultOpen: true }, () => [
            h(DropdownMenuTrigger, () => 'Open'),
            h(DropdownMenuContent, () => [
              h(DropdownMenuItem, { value: 'pear' }, () => 'Pear'),
              h(DropdownMenuItem, { value: 'apple', disabled: true }, () => 'Apple'),
              h(DropdownMenuItem, { value: 'plum' }, () => 'Plum'),
              h(DropdownMenuItem, { value: 'peach' }, () => 'Peach'),
            ]),
          ]),
          h(DropdownMenu, () => [
            h(DropdownMenuTrigger, () => 'Closed'),
            h(DropdownMenuContent, () => h(DropdownMenuItem, { value: 'pear' }, () => 'Pear')),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const menus = () => document.querySelectorAll('[data-slot="dropdown-menu-content"]')
    const highlighted = () => document.querySelector('[data-slot="dropdown-menu-item"][data-highlighted]')?.textContent?.trim()
    const menu = menus()[0] as HTMLElement
    const press = async (key: string) => {
      menu.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
      await Promise.resolve()
    }
    await press('p')
    expect(highlighted()).toBe('Pear')
    await press('p')
    expect(highlighted()).toBe('Plum')
    await press('p')
    expect(highlighted()).toBe('Peach')
    await press('z')
    expect(highlighted()).toBe('Peach')
    expect(menus()).toHaveLength(1)
    const closed = [...document.querySelectorAll('[data-slot="dropdown-menu-trigger"]')].find((node) =>
      node.textContent?.includes('Closed')
    ) as HTMLButtonElement
    closed.focus()
    closed.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
    await nextTick()
    expect(menus()).toHaveLength(1)
  })

  it('hides the shortcut from the item name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(DropdownMenuShortcut, () => '⌘P'),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="dropdown-menu-shortcut"]')?.getAttribute('aria-hidden')).toBe('true')
    expect(host.querySelector('[data-slot="dropdown-menu-shortcut"]')?.textContent).toBe('⌘P')
  })
})
