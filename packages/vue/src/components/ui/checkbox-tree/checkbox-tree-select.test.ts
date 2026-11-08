import { createApp, defineComponent, h, nextTick, ref, type VNodeChild } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import type { CheckboxTreeNode } from '@timui/core'

import CheckboxTree from '../checkbox/checkbox-tree.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const tree: CheckboxTreeNode = {
  id: 'root',
  label: 'Root',
  children: [
    { id: 'a', label: 'A' },
    { id: 'b', label: 'B', disabled: true },
  ],
}

const show = async () => {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(CheckboxTree, {
        tree,
        renderNode: ({
          node,
          isChecked,
          onCheckedChange,
          children,
        }: {
          node: CheckboxTreeNode
          isChecked: boolean | 'indeterminate'
          onCheckedChange: () => void
          children?: VNodeChild
        }) =>
          h('div', {}, [
            h(
              'button',
              { type: 'button', 'data-id': node.id, 'data-state': String(isChecked), onClick: onCheckedChange },
              () => node.label
            ),
            children,
          ]),
      }),
  })
  app.mount(host)
  mounted.push({ unmount: () => app.unmount(), host })
  await nextTick()
}

const state = (id: string) => document.querySelector(`[data-id="${id}"]`)?.getAttribute('data-state')

const click = async (id: string) => {
  ;(document.querySelector(`[data-id="${id}"]`) as HTMLButtonElement).click()
  await nextTick()
}

describe('vue checkbox tree selection', () => {
  it('follows a later checked list and ignores a disabled node', async () => {
    const keys = ref(['a'])
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (keys.value = ['b']) }, 'Next'),
              h('button', { type: 'button', onClick: () => (keys.value = []) }, 'Clear'),
              h(CheckboxTree, {
                tree,
                checkedKeys: keys.value,
                renderNode: ({
                  node,
                  isChecked,
                  onCheckedChange,
                  children,
                }: {
                  node: CheckboxTreeNode
                  isChecked: boolean | 'indeterminate'
                  onCheckedChange: () => void
                  children?: VNodeChild
                }) =>
                  h('div', {}, [
                    h(
                      'button',
                      { type: 'button', 'data-id': node.id, 'data-state': String(isChecked), onClick: onCheckedChange },
                      () => node.label
                    ),
                    children,
                  ]),
              }),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(state('a')).toBe('true')
    expect(state('b')).toBe('false')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('1 checked')
    await click('b')
    expect(state('b')).toBe('false')
    const press = (label: string) =>
      [...host.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Next')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(state('a')).toBe('false')
    expect(state('b')).toBe('true')
    press('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(state('a')).toBe('false')
    expect(state('b')).toBe('false')
    expect(host.querySelector('[role="status"]')).toBeNull()
  })

  it('checks enabled descendants and ignores a disabled node', async () => {
    await show()
    await click('root')
    expect(state('root')).toBe('true')
    expect(state('a')).toBe('true')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('2 checked')
    expect(state('b')).toBe('false')
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
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(CheckboxTree, {
          tree: seeded,
          checkedKeys: null,
          renderNode: ({
            node,
            isChecked,
            onCheckedChange,
            children,
          }: {
            node: CheckboxTreeNode
            isChecked: boolean | 'indeterminate'
            onCheckedChange: () => void
            children?: VNodeChild
          }) =>
            h('div', {}, [
              h(
                'button',
                { type: 'button', 'data-id': node.id, 'data-state': String(isChecked), onClick: onCheckedChange },
                () => node.label
              ),
              children,
            ]),
        }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(state('a')).toBe('false')
    await click('a')
    expect(state('a')).toBe('false')
  })

  it('reports the next checked ids while controlled and ignores a disabled node', async () => {
    const seen: string[][] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(CheckboxTree, {
          tree,
          checkedKeys: ['a'],
          onCheckedKeysChange: (next: string[]) => seen.push(next),
          renderNode: ({
            node,
            isChecked,
            onCheckedChange,
            children,
          }: {
            node: CheckboxTreeNode
            isChecked: boolean | 'indeterminate'
            onCheckedChange: () => void
            children?: VNodeChild
          }) =>
            h('div', {}, [
              h(
                'button',
                { type: 'button', 'data-id': node.id, 'data-state': String(isChecked), onClick: onCheckedChange },
                () => node.label
              ),
              children,
            ]),
        }),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    await click('b')
    expect(seen).toEqual([])
    expect(state('a')).toBe('true')
    await click('a')
    expect(seen).toEqual([[]])
    expect(state('a')).toBe('true')
  })
})
