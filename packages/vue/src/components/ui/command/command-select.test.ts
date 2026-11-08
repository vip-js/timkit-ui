import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Command from './command.vue'
import CommandEmpty from './command-empty.vue'
import CommandInput from './command-input.vue'
import CommandItem from './command-item.vue'
import CommandList from './command-list.vue'
import CommandShortcut from './command-shortcut.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = async (disabled = false) => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(Command, { disabled }, () =>
        h(CommandList, () => [
          h(CommandItem, { value: 'open', label: 'Open' }, () => 'Open'),
          h(CommandItem, { value: 'close', label: 'Close', disabled: true }, () => 'Close'),
        ])
      ),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const state = (value: string) =>
  document.querySelector(`[data-value="${value}"]`)?.getAttribute('data-state')

describe('vue command selection', () => {
  it('follows a later value and ignores a disabled item', async () => {
    const value = ref('open')
    const locked = ref('open')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = 'save') }, 'Next'),
              h('button', { type: 'button', onClick: () => (locked.value = '') }, 'Clear'),
              h(Command, { modelValue: value.value }, () =>
                h(CommandList, () => [
                  h(CommandItem, { value: 'open', label: 'Open' }, () => 'Open'),
                  h(CommandItem, { value: 'save', label: 'Save' }, () => 'Save'),
                  h(CommandItem, { value: 'close', label: 'Close', disabled: true }, () => 'Close'),
                ])
              ),
              h(Command, { disabled: true, modelValue: locked.value }, () =>
                h(CommandList, () => [
                  h(CommandItem, { value: 'open', label: 'Locked' }, () => 'Locked'),
                  h(CommandItem, { value: 'save', label: 'Other' }, () => 'Other'),
                ])
              ),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const item = (label: string) =>
      [...host.querySelectorAll('[data-slot="command-item"]')].find((node) => node.textContent?.includes(label))
    expect(item('Open')?.getAttribute('data-state')).toBe('checked')
    expect(item('Locked')?.getAttribute('data-state')).toBe('checked')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Item 1 of 3',
      'Item 1 of 2',
    ])
    ;(item('Close') as HTMLElement).click()
    ;(item('Save') as HTMLElement).click()
    ;(item('Other') as HTMLElement).click()
    await nextTick()
    expect(item('Open')?.getAttribute('data-state')).toBe('checked')
    expect(item('Save')?.getAttribute('data-state')).not.toBe('checked')
    expect(item('Locked')?.getAttribute('data-state')).toBe('checked')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Next')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    press('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(item('Save')?.getAttribute('data-state')).toBe('checked')
    expect(item('Open')?.getAttribute('data-state')).not.toBe('checked')
    expect(item('Locked')?.getAttribute('data-state')).not.toBe('checked')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual(['Item 2 of 3'])
  })

  it('selects an item and ignores a disabled item or palette', async () => {
    await show()
    ;(document.querySelector('[data-value="open"]') as HTMLElement).click()
    await nextTick()
    expect(state('open')).toBe('checked')
    ;(document.querySelector('[data-value="close"]') as HTMLElement).click()
    await nextTick()
    expect(state('close')).not.toBe('checked')

    document.body.innerHTML = ''
    await show(true)
    ;(document.querySelector('[data-value="open"]') as HTMLElement).click()
    await nextTick()
    expect(state('open')).not.toBe('checked')
  })

  it('stays unchecked when the model is null even if the default is open', async () => {
    const seen: Array<string | undefined> = []
    const selected: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Command,
          { modelValue: null, defaultValue: 'open', onChange: (value?: string | null) => seen.push(value ?? undefined) },
          () =>
            h(CommandList, () => [
              h(CommandItem, { value: 'open', label: 'Open' }, () => 'Open'),
              h(
                CommandItem,
                { value: 'save', label: 'Save', onSelect: (value: string) => selected.push(value) },
                () => 'Save'
              ),
            ])
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const item = (label: string) =>
      [...host.querySelectorAll('[data-slot="command-item"]')].find((node) => node.textContent?.includes(label))
    expect(item('Open')?.getAttribute('data-state')).not.toBe('checked')
    ;(item('Save') as HTMLElement).click()
    await nextTick()
    expect(item('Open')?.getAttribute('data-state')).not.toBe('checked')
    expect(item('Save')?.getAttribute('data-state')).not.toBe('checked')
    expect(seen).toEqual(['save'])
    expect(selected).toEqual(['save'])
  })

  it('filters the list and shows the empty state when nothing matches', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Command, () => [
          h(CommandInput),
          h(CommandList, () => [
            h(CommandItem, { value: 'open', label: 'Open' }, () => 'Open'),
            h(CommandItem, { value: 'save', label: 'Save' }, () => 'Save'),
            h(CommandEmpty, () => 'No results'),
          ]),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const item = (label: string) =>
      [...host.querySelectorAll('[data-slot="command-item"]')].find((node) => node.textContent?.includes(label))
    expect(item('Open')?.hasAttribute('hidden')).toBe(false)
    expect(item('Save')?.hasAttribute('hidden')).toBe(false)
    expect(host.querySelector('[role="status"]')).toBeNull()
    const input = host.querySelector('input') as HTMLInputElement
    expect(input.getAttribute('aria-label')).toBe('Command menu')
    input.value = 'sa'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(item('Save')?.hasAttribute('hidden')).toBe(false)
    expect(item('Open')?.hasAttribute('hidden')).toBe(true)
    expect(host.querySelector('[role="status"]')).toBeNull()
    input.value = 'zzz'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(host.querySelector('[role="status"]')?.textContent).toBe('No results')
    expect(item('Open')?.hasAttribute('hidden')).toBe(true)
    expect(item('Save')?.hasAttribute('hidden')).toBe(true)

    const locked = document.createElement('div')
    document.body.append(locked)
    const disabled = createApp({
      render: () =>
        h(Command, { disabled: true }, () => [
          h(CommandInput),
          h(CommandList, () => [h(CommandItem, { value: 'open', label: 'Open' }, () => 'Open')]),
        ]),
    })
    disabled.mount(locked)
    mounted.push({ unmount: () => disabled.unmount(), host: locked })
    await nextTick()
    const lockedInput = locked.querySelector('input') as HTMLInputElement
    expect(lockedInput.disabled).toBe(true)
    lockedInput.value = 'zzz'
    lockedInput.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(locked.querySelector('[data-slot="command-item"]')?.hasAttribute('hidden')).toBe(false)
  })

  it('names an omitted list Suggestions', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Command, () =>
          h(CommandList, () => h(CommandItem, { value: 'open', label: 'Open' }, () => 'Open'))
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="command-list"]')?.getAttribute('aria-label')).toBe('Suggestions')
  })

  it('hides the shortcut from the option name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Command, () =>
          h(CommandList, () =>
            h(CommandItem, { value: 'open', label: 'Open' }, () => [
              'Open',
              h(CommandShortcut, () => '⌘S'),
            ])
          )
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="command-shortcut"]')?.getAttribute('aria-hidden')).toBe('true')
    expect(host.querySelector('[data-slot="command-shortcut"]')?.textContent).toBe('⌘S')
  })
})
