import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Tree from './tree.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const labels = () => Array.from(document.querySelectorAll('[data-slot="tree-item"]'), (node) => node.textContent?.trim())
const item = (label: string) =>
  Array.from(document.querySelectorAll('[data-slot="tree-item"]')).find((node) => node.textContent?.trim() === label) as HTMLButtonElement

const nodes = [{ id: 'a', label: 'Parent', children: [{ id: 'b', label: 'Child' }] }]

const selectedLabel = (index: number) =>
  document.querySelectorAll('[data-slot="tree"]')[index]?.querySelector('[data-selected]')?.textContent?.trim()

describe('vue tree data', () => {
  it('follows a later selected node and keeps a disabled tree closed', async () => {
    const selected = ref('a')
    const locked = ref('a')
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (selected.value = '') }, 'Clear'),
              h('button', { type: 'button', onClick: () => (locked.value = '') }, 'Unlock'),
              h(Tree, { data: nodes, selected: selected.value }),
              h(Tree, { data: nodes, disabled: true, selected: locked.value }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(host.querySelector('[data-slot="tree"]')?.getAttribute('role')).toBe('tree')
    expect(host.querySelector('[data-slot="tree"]')?.getAttribute('aria-label')).toBe('Tree')
    expect(selectedLabel(0)).toBe('Parent')
    expect(selectedLabel(1)).toBe('Parent')
    expect([...host.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Node 1 of 1',
      'Node 1 of 1',
    ])
    const lockedItem = host.querySelectorAll('[data-slot="tree"]')[1]?.querySelector('[data-slot="tree-item"]') as HTMLButtonElement
    lockedItem.click()
    await nextTick()
    expect(labels()).not.toContain('Child')
    const click = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    click('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('Unlock')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(selectedLabel(0)).toBeUndefined()
    expect(selectedLabel(1)).toBeUndefined()
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('expands a branch, selects a leaf, and ignores both while disabled', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Tree, { data: nodes }), h(Tree, { data: nodes, disabled: true })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(labels().filter((label) => label === 'Parent')).toHaveLength(2)
    expect(labels()).not.toContain('Child')
    item('Parent').click()
    await nextTick()
    expect(labels()).toContain('Child')
    item('Child').click()
    await nextTick()
    expect(item('Child').hasAttribute('data-selected')).toBe(true)
    item('Parent').click()
    await nextTick()
    expect(labels()).not.toContain('Child')
    const locked = document.querySelectorAll('[data-slot="tree"]')[1]?.querySelector('[data-slot="tree-item"]') as HTMLButtonElement
    locked.click()
    await nextTick()
    expect(locked.disabled).toBe(true)
    expect(locked.getAttribute('aria-expanded')).toBe('false')
  })

  it('reports the next selected node while controlled and ignores a disabled tree', async () => {
    const seen: string[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Tree, { data: nodes, selected: 'a', onSelectedChange: (id: string) => seen.push(id) }),
          h(Tree, { data: nodes, disabled: true, selected: 'a', onSelectedChange: (id: string) => seen.push(id) }),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    item('Parent').click()
    await nextTick()
    expect(seen).toEqual([])
    expect(labels()).toContain('Child')
    item('Child').click()
    await nextTick()
    expect(seen).toEqual(['b'])
    expect(item('Parent').hasAttribute('data-selected')).toBe(true)
    expect(item('Child').hasAttribute('data-selected')).toBe(false)
    const locked = document.querySelectorAll('[data-slot="tree"]')[1]?.querySelector('[data-slot="tree-item"]') as HTMLButtonElement
    locked.click()
    await nextTick()
    expect(seen).toEqual(['b'])
    expect(locked.getAttribute('aria-expanded')).toBe('false')
  })

  it('moves through visible rows with the arrow keys', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(defineComponent({ setup: () => () => h(Tree, { data: nodes }) }))
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const parent = item('Parent')
    expect(parent.getAttribute('role')).toBe('treeitem')
    expect(parent.getAttribute('aria-level')).toBe('1')
    expect(parent.tabIndex).toBe(0)
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    expect(labels()).toContain('Child')
    const child = item('Child')
    expect(child.getAttribute('aria-level')).toBe('2')
    expect(child.tabIndex).toBe(-1)
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(child)
    expect(child.tabIndex).toBe(0)
    child.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(parent)
    parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    await nextTick()
    expect(labels()).not.toContain('Child')
  })

  it('moves to the first and last visible row with Home and End without opening a branch', async () => {
    const rows = [
      { id: 'a', label: 'Parent', children: [{ id: 'b', label: 'Child' }] },
      { id: 'c', label: 'Sibling' },
    ]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Tree, { data: rows }), h(Tree, { data: rows, disabled: true })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const tree = (index: number) => document.querySelectorAll('[data-slot="tree"]')[index]
    const row = (index: number, label: string) =>
      [...tree(index).querySelectorAll('[data-slot="tree-item"]')].find((node) => node.textContent === label) as HTMLButtonElement
    expect(row(0, 'Parent').tabIndex).toBe(0)
    expect(tree(0).textContent).not.toContain('Child')
    row(0, 'Parent').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(row(0, 'Sibling'))
    expect(row(0, 'Sibling').tabIndex).toBe(0)
    expect(tree(0).textContent).not.toContain('Child')
    expect(tree(0).querySelector('[data-selected]')).toBeNull()
    row(0, 'Sibling').dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(row(0, 'Parent'))
    row(1, 'Parent').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await nextTick()
    expect(row(1, 'Parent').tabIndex).toBe(-1)
    expect(row(1, 'Sibling').tabIndex).toBe(-1)
    expect(tree(1).textContent).not.toContain('Child')
  })

  it('moves to the next visible row whose label starts with a letter without selecting it', async () => {
    const rows = [
      { id: 'parent', label: 'Parent', children: [{ id: 'child', label: 'Pear' }] },
      { id: 'plum', label: 'Plum' },
      { id: 'peach', label: 'Peach' },
    ]
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Tree, { data: rows }), h(Tree, { data: rows, disabled: true })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const tree = (index: number) => document.querySelectorAll('[data-slot="tree"]')[index]
    const row = (index: number, label: string) =>
      [...tree(index).querySelectorAll('[data-slot="tree-item"]')].find((node) => node.textContent === label) as HTMLButtonElement
    const press = async (label: string, key: string) => {
      row(0, label).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      await nextTick()
    }
    expect(tree(0).textContent).not.toContain('Pear')
    await press('Parent', 'p')
    expect(document.activeElement).toBe(row(0, 'Plum'))
    expect(tree(0).textContent).not.toContain('Pear')
    expect(tree(0).querySelector('[data-selected]')).toBeNull()
    await press('Plum', 'p')
    expect(document.activeElement).toBe(row(0, 'Peach'))
    await press('Peach', 'z')
    expect(document.activeElement).toBe(row(0, 'Peach'))
    row(1, 'Parent').dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
    await nextTick()
    expect(row(1, 'Parent').tabIndex).toBe(-1)
    expect(tree(1).textContent).not.toContain('Pear')
  })

  it('indents a child row by the indent prop', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h(Tree, { data: nodes, indent: 32 }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    item('Parent').click()
    await nextTick()
    expect(item('Parent').style.paddingLeft).toBe('0px')
    expect(item('Child').style.paddingLeft).toBe('32px')
  })
})
