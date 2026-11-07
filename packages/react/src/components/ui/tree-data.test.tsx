// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Tree } from './tree'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (node: ReactNode) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(node))
  mounted.push({ root, host })
}

const labels = () => Array.from(document.querySelectorAll('[data-slot="tree-item"]'), (node) => node.textContent)
const item = (label: string) =>
  Array.from(document.querySelectorAll('[data-slot="tree-item"]')).find((node) => node.textContent === label) as HTMLButtonElement

const nodes = [{ id: 'a', label: 'Parent', children: [{ id: 'b', label: 'Child' }] }]

const selectedLabel = (index: number) =>
  document.querySelectorAll('[data-slot="tree"]')[index]?.querySelector('[data-selected]')?.textContent

describe('tree data', () => {
  it('follows a later selected node and keeps a disabled tree closed', () => {
    function Harness() {
      const [selected, setSelected] = useState('a')
      const [locked, setLocked] = useState('a')
      return (
        <>
          <button type="button" onClick={() => setSelected('')}>
            Clear
          </button>
          <button type="button" onClick={() => setLocked('')}>
            Unlock
          </button>
          <Tree data={nodes} selected={selected} />
          <Tree data={nodes} disabled selected={locked} />
        </>
      )
    }
    show(<Harness />)
    expect(document.querySelector('[data-slot="tree"]')?.getAttribute('role')).toBe('tree')
    expect(document.querySelector('[data-slot="tree"]')?.getAttribute('aria-label')).toBe('Tree')
    expect(selectedLabel(0)).toBe('Parent')
    expect(selectedLabel(1)).toBe('Parent')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Node 1 of 1',
      'Node 1 of 1',
    ])
    const locked = document.querySelectorAll('[data-slot="tree"]')[1]?.querySelector('[data-slot="tree-item"]') as HTMLButtonElement
    act(() => {
      locked.click()
    })
    expect(labels()).not.toContain('Child')
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    act(() => {
      click('Clear')?.click()
      click('Unlock')?.click()
    })
    expect(selectedLabel(0)).toBeUndefined()
    expect(selectedLabel(1)).toBeUndefined()
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  it('expands a branch, selects a leaf, and ignores both while disabled', () => {
    show(
      <>
        <Tree data={nodes} />
        <Tree data={nodes} disabled />
      </>
    )
    expect(labels().filter((label) => label === 'Parent')).toHaveLength(2)
    expect(labels()).not.toContain('Child')
    act(() => {
      item('Parent').click()
    })
    expect(labels()).toContain('Child')
    act(() => {
      item('Child').click()
    })
    expect(item('Child').hasAttribute('data-selected')).toBe(true)
    act(() => {
      item('Parent').click()
    })
    expect(labels()).not.toContain('Child')
    const locked = document.querySelectorAll('[data-slot="tree"]')[1]?.querySelector('[data-slot="tree-item"]') as HTMLButtonElement
    act(() => {
      locked.click()
    })
    expect(locked.disabled).toBe(true)
    expect(locked.getAttribute('aria-expanded')).toBe('false')
  })

  it('reports the next selected node while controlled and ignores a disabled tree', () => {
    const seen: string[] = []
    show(
      <>
        <Tree data={nodes} selected="a" onSelectedChange={(id) => seen.push(id)} />
        <Tree data={nodes} disabled selected="a" onSelectedChange={(id) => seen.push(id)} />
      </>
    )
    act(() => {
      item('Parent').click()
    })
    expect(seen).toEqual([])
    expect(labels()).toContain('Child')
    act(() => {
      item('Child').click()
    })
    expect(seen).toEqual(['b'])
    expect(item('Parent').hasAttribute('data-selected')).toBe(true)
    expect(item('Child').hasAttribute('data-selected')).toBe(false)
    const locked = document.querySelectorAll('[data-slot="tree"]')[1]?.querySelector('[data-slot="tree-item"]') as HTMLButtonElement
    act(() => {
      locked.click()
    })
    expect(seen).toEqual(['b'])
    expect(locked.getAttribute('aria-expanded')).toBe('false')
  })

  it('moves through visible rows with the arrow keys', () => {
    show(<Tree data={nodes} />)
    const parent = item('Parent')
    expect(parent.getAttribute('role')).toBe('treeitem')
    expect(parent.getAttribute('aria-level')).toBe('1')
    expect(parent.tabIndex).toBe(0)
    act(() => {
      parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    })
    expect(labels()).toContain('Child')
    const child = item('Child')
    expect(child.getAttribute('aria-level')).toBe('2')
    expect(child.tabIndex).toBe(-1)
    act(() => {
      parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    })
    expect(document.activeElement).toBe(child)
    expect(child.tabIndex).toBe(0)
    act(() => {
      child.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    })
    expect(document.activeElement).toBe(parent)
    act(() => {
      parent.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    })
    expect(labels()).not.toContain('Child')
  })

  it('moves to the first and last visible row with Home and End without opening a branch', () => {
    const rows = [
      { id: 'a', label: 'Parent', children: [{ id: 'b', label: 'Child' }] },
      { id: 'c', label: 'Sibling' },
    ]
    show(
      <>
        <Tree data={rows} />
        <Tree data={rows} disabled />
      </>
    )
    const tree = (index: number) => document.querySelectorAll('[data-slot="tree"]')[index]
    const row = (index: number, label: string) =>
      [...tree(index).querySelectorAll('[data-slot="tree-item"]')].find((node) => node.textContent === label) as HTMLButtonElement
    expect(row(0, 'Parent').tabIndex).toBe(0)
    expect(tree(0).textContent).not.toContain('Child')
    act(() => {
      row(0, 'Parent').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    })
    expect(document.activeElement).toBe(row(0, 'Sibling'))
    expect(row(0, 'Sibling').tabIndex).toBe(0)
    expect(tree(0).textContent).not.toContain('Child')
    expect(tree(0).querySelector('[data-selected]')).toBeNull()
    act(() => {
      row(0, 'Sibling').dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    })
    expect(document.activeElement).toBe(row(0, 'Parent'))
    act(() => {
      row(1, 'Parent').dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    })
    expect(row(1, 'Parent').tabIndex).toBe(-1)
    expect(row(1, 'Sibling').tabIndex).toBe(-1)
    expect(tree(1).textContent).not.toContain('Child')
  })

  it('moves to the next visible row whose label starts with a letter without selecting it', () => {
    const rows = [
      { id: 'parent', label: 'Parent', children: [{ id: 'child', label: 'Pear' }] },
      { id: 'plum', label: 'Plum' },
      { id: 'peach', label: 'Peach' },
    ]
    show(
      <>
        <Tree data={rows} />
        <Tree data={rows} disabled />
      </>
    )
    const tree = (index: number) => document.querySelectorAll('[data-slot="tree"]')[index]
    const row = (index: number, label: string) =>
      [...tree(index).querySelectorAll('[data-slot="tree-item"]')].find((node) => node.textContent === label) as HTMLButtonElement
    const press = (label: string, key: string) => {
      act(() => {
        row(0, label).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    }
    expect(tree(0).textContent).not.toContain('Pear')
    press('Parent', 'p')
    expect(document.activeElement).toBe(row(0, 'Plum'))
    expect(tree(0).textContent).not.toContain('Pear')
    expect(tree(0).querySelector('[data-selected]')).toBeNull()
    press('Plum', 'p')
    expect(document.activeElement).toBe(row(0, 'Peach'))
    press('Peach', 'z')
    expect(document.activeElement).toBe(row(0, 'Peach'))
    act(() => {
      row(1, 'Parent').dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
    })
    expect(row(1, 'Parent').tabIndex).toBe(-1)
    expect(tree(1).textContent).not.toContain('Pear')
  })

  it('indents a child row by the indent prop', () => {
    show(<Tree data={nodes} indent={32} />)
    act(() => {
      item('Parent').click()
    })
    expect(item('Parent').style.paddingLeft).toBe('0px')
    expect(item('Child').style.paddingLeft).toBe('32px')
  })
})
