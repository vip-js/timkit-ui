// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import type { CheckboxTreeNode } from '@timui/core'

import { CheckboxTree } from './checkbox-tree'

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

const tree: CheckboxTreeNode = {
  id: 'root',
  label: 'Root',
  children: [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B', disabled: true },
  ],
}

const state = (id: string) => document.querySelector(`[data-id="${id}"]`)?.getAttribute('data-state')

const click = async (id: string) => {
  const button = document.querySelector(`[data-id="${id}"]`) as HTMLButtonElement
  await act(async () => {
    button.click()
  })
}

describe('checkbox tree selection', () => {
  it('follows a later checked list and ignores a disabled node', async () => {
    function Harness() {
      const [keys, setKeys] = useState(['a'])
      return (
        <>
          <button type="button" onClick={() => setKeys(['b'])}>
            Next
          </button>
          <button type="button" onClick={() => setKeys([])}>
            Clear
          </button>
          <CheckboxTree
            tree={tree}
            checkedKeys={keys}
            renderNode={({ node, isChecked, onCheckedChange, children }) => (
              <div>
                <button type="button" data-id={node.id} data-state={String(isChecked)} onClick={onCheckedChange}>
                  {node.label}
                </button>
                {children}
              </div>
            )}
          />
        </>
      )
    }
    show(<Harness />)
    expect(state('a')).toBe('true')
    expect(state('b')).toBe('false')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('1 checked')
    await click('b')
    expect(state('b')).toBe('false')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      press('Next')?.click()
    })
    expect(state('a')).toBe('false')
    expect(state('b')).toBe('true')
    await act(async () => {
      press('Clear')?.click()
    })
    expect(state('a')).toBe('false')
    expect(state('b')).toBe('false')
    expect(document.querySelector('[role="status"]')).toBeNull()
  })

  it('checks enabled descendants and ignores a disabled node', async () => {
    show(
      <CheckboxTree
        tree={tree}
        renderNode={({ node, isChecked, onCheckedChange, children }) => (
          <div>
            <button type="button" data-id={node.id} data-state={String(isChecked)} onClick={onCheckedChange}>
              {node.label}
            </button>
            {children}
          </div>
        )}
      />
    )
    await click('root')
    expect(state('root')).toBe('true')
    expect(state('a')).toBe('true')
    expect(state('b')).toBe('false')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2 checked')
    await click('b')
    expect(state('b')).toBe('false')
    await click('root')
    expect(state('a')).toBe('false')
  })

  it('stays empty when checked keys are null even if a node starts checked', async () => {
    const seeded: CheckboxTreeNode = {
      id: 'root',
      label: 'Root',
      children: [{ id: 'a', label: 'A', defaultChecked: true }],
    }
    show(
      <CheckboxTree
        tree={seeded}
        checkedKeys={null as unknown as string[]}
        renderNode={({ node, isChecked, onCheckedChange, children }) => (
          <div>
            <button type="button" data-id={node.id} data-state={String(isChecked)} onClick={onCheckedChange}>
              {node.label}
            </button>
            {children}
          </div>
        )}
      />
    )
    expect(state('a')).toBe('false')
    await click('a')
    expect(state('a')).toBe('false')
  })

  it('reports the next checked ids while controlled and ignores a disabled node', async () => {
    const seen: string[][] = []
    show(
      <CheckboxTree
        tree={tree}
        checkedKeys={['a']}
        onCheckedKeysChange={(next) => seen.push(next)}
        renderNode={({ node, isChecked, onCheckedChange, children }) => (
          <div>
            <button type="button" data-id={node.id} data-state={String(isChecked)} onClick={onCheckedChange}>
              {node.label}
            </button>
            {children}
          </div>
        )}
      />
    )
    await click('b')
    expect(seen).toEqual([])
    expect(state('a')).toBe('true')
    await click('a')
    expect(seen).toEqual([[]])
    expect(state('a')).toBe('true')
  })
})
