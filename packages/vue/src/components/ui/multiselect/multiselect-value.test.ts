import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Multiselect from './multiselect.vue'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
Element.prototype.scrollIntoView = () => {}
Element.prototype.scrollTo = () => {}

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const options = [
  { value: 'pear', label: 'Pear' },
  { value: 'apple', label: 'Apple', disable: true },
]

const clickItem = async (label: string) => {
  const item = [...document.querySelectorAll('[data-slot="command-item"]')].find((node) =>
    node.textContent?.includes(label)
  ) as HTMLElement & { __vueParentComponent?: { vnode?: { props?: { onClick?: (event: Event) => void } } } }
  const handler = item.__vueParentComponent?.vnode?.props?.onClick
  if (typeof handler !== 'function') throw new Error(`${label} has no click handler`)
  handler(new MouseEvent('click', { bubbles: true }))
  await nextTick()
}

describe('vue multiselect', () => {
  it('follows a later value and keeps a disabled field closed', async () => {
    const value = ref([{ value: 'pear', label: 'Pear' }])
    const locked = ref([{ value: 'pear', label: 'Pear' }])
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
                  onClick: () =>
                    (value.value = [
                      { value: 'pear', label: 'Pear' },
                      { value: 'apple', label: 'Apple' },
                    ]),
                },
                'Both'
              ),
              h('button', { type: 'button', onClick: () => (value.value = [{ value: 'plum', label: 'Plum' }]) }, 'Replace'),
              h('button', { type: 'button', onClick: () => (locked.value = []) }, 'Clear'),
              h(Multiselect, { modelValue: value.value, defaultOptions: options }),
              h(Multiselect, { disabled: true, modelValue: locked.value, defaultOptions: options }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const roots = () => host.querySelectorAll('[data-slot="multiselect"]')
    const click = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    expect(roots()[0]?.textContent).toContain('Pear')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Option 1 of 2',
      'Option 1 of 2',
    ])
    click('Both')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      '2 options selected',
      'Option 1 of 2',
    ])
    click('Replace')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(roots()[0]?.textContent).toContain('Plum')
    expect(roots()[0]?.textContent).not.toContain('Pear')
    expect(roots()[1]?.textContent).not.toContain('Pear')
    expect(host.querySelector('[role="status"]')).toBeNull()
    ;(roots()[1] as HTMLElement).click()
    await nextTick()
    expect(host.textContent).not.toContain('Apple')
  })

  it('selects an option, ignores a disabled option, and stays closed when the field is disabled', async () => {
    const seen: string[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => [
        h(Multiselect, { defaultOptions: options, onChange: (next: Array<{ value: string }>) => seen.push(next.map((option) => option.value)) }),
        h(Multiselect, { disabled: true, defaultOptions: [{ value: 'locked', label: 'Locked' }] }),
      ],
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const roots = document.querySelectorAll('[data-slot="multiselect"]')
    ;(roots[0] as HTMLElement).click()
    await nextTick()
    await clickItem('Pear')
    expect(roots[0]?.textContent).toContain('Pear')
    await clickItem('Apple')
    expect(seen).toEqual([['pear']])
    ;(roots[1] as HTMLElement).click()
    await nextTick()
    expect(document.body.textContent).not.toContain('Locked')
  })

  it('stays empty when the model is null and asks before adding', async () => {
    const value = ref<Array<{ value: string; label: string }> | null>([{ value: 'pear', label: 'Pear' }])
    const seen: string[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (value.value = null) }, 'Clear'),
              h(Multiselect, {
                modelValue: value.value,
                defaultOptions: options,
                onChange: (next: Array<{ value: string }>) => seen.push(next.map((option) => option.value)),
              }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const root = host.querySelector('[data-slot="multiselect"]') as HTMLElement
    expect(root.textContent).toContain('Pear')
    expect(root.querySelector('button')?.getAttribute('aria-label')).toBe('Remove')
    ;[...host.querySelectorAll('button')].find((button) => button.textContent === 'Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(root.textContent).not.toContain('Pear')
    root.click()
    await nextTick()
    await clickItem('Pear')
    expect(root.textContent).not.toContain('Pear')
    expect(seen.at(-1)).toEqual(['pear'])
  })

  it('stays closed while open is false and follows a later open value', async () => {
    const seen: boolean[] = []
    const open = ref(false)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (open.value = true) }, 'Open'),
              h(Multiselect, {
                open: open.value,
                defaultOpen: true,
                defaultOptions: options,
                onOpenChange: (next: boolean) => seen.push(next),
              }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const list = () => host.querySelector('[data-slot="multiselect-popup"]')
    expect(list()?.getAttribute('data-state')).toBe('closed')
    ;(host.querySelector('[data-slot="multiselect"]') as HTMLElement).click()
    await nextTick()
    expect(list()?.getAttribute('data-state')).toBe('closed')
    expect(seen).toEqual([true])
    ;[...host.querySelectorAll('button')].find((button) => button.textContent === 'Open')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    )
    await nextTick()
    expect(list()?.getAttribute('data-state')).toBe('open')
  })

  it('closes on Escape and keeps focus on the field', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Multiselect, { defaultOptions: options }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const input = host.querySelector('[data-slot="multiselect"] input') as HTMLInputElement
    input.focus()
    await nextTick()
    const list = () => document.querySelector('[data-slot="multiselect-popup"]')
    expect(list()?.getAttribute('data-state')).toBe('open')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(list()?.getAttribute('data-state')).toBe('closed')
    expect(document.activeElement).toBe(input)
  })
})
