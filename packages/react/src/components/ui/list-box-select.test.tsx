// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { ListBox } from './list-box'
import { ListBoxItem } from './list-box-item'

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

const selected = (value: string) =>
  document.querySelector(`[data-slot="list-box-item"][data-value="${value}"]`)?.getAttribute('data-selected')

const click = async (value: string) => {
  await act(async () => {
    ;(document.querySelector(`[data-value="${value}"]`) as HTMLElement).click()
  })
}

const highlighted = () =>
  document.querySelector('[data-slot="list-box-item"][data-highlighted]')?.getAttribute('data-value')

describe('list box selection', () => {
  it('follows a later value and keeps a disabled list on its current item', async () => {
    function Harness() {
      const [value, setValue] = useState('apple')
      const [locked, setLocked] = useState<string | null>('apple')
      return (
        <>
          <button type="button" onClick={() => setValue('pear')}>
            Next
          </button>
          <button type="button" onClick={() => setLocked(null)}>
            Clear
          </button>
          <ListBox selectedKeys={[value]}>
            <ListBoxItem value="apple">Apple</ListBoxItem>
            <ListBoxItem value="pear">Pear</ListBoxItem>
            <ListBoxItem value="plum" isDisabled>
              Plum
            </ListBoxItem>
          </ListBox>
          <ListBox disabled selectedKeys={locked == null ? null : [locked]}>
            <ListBoxItem value="apple">Locked</ListBoxItem>
            <ListBoxItem value="pear">Other</ListBoxItem>
          </ListBox>
        </>
      )
    }
    show(<Harness />)
    const mark = (label: string) =>
      [...document.querySelectorAll('[data-slot="list-box-item"]')].find((item) => item.textContent?.includes(label))
    expect(mark('Apple')?.getAttribute('data-selected')).toBe('true')
    expect(mark('Pear')?.getAttribute('data-selected')).toBeNull()
    expect(mark('Locked')?.getAttribute('data-selected')).toBe('true')
    await act(async () => {
      ;(mark('Other') as HTMLElement).click()
      ;(mark('Plum') as HTMLElement).click()
    })
    expect(mark('Apple')?.getAttribute('data-selected')).toBe('true')
    expect(mark('Locked')?.getAttribute('data-selected')).toBe('true')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      press('Next')?.click()
      press('Clear')?.click()
    })
    expect(mark('Apple')?.getAttribute('data-selected')).toBeNull()
    expect(mark('Pear')?.getAttribute('data-selected')).toBe('true')
    expect(mark('Locked')?.getAttribute('data-selected')).toBeNull()
  })

  it('selects one item, replaces it, and ignores a disabled item or list', async () => {
    show(
      <ListBox>
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="pear">Pear</ListBoxItem>
        <ListBoxItem value="plum" isDisabled>
          Plum
        </ListBoxItem>
      </ListBox>
    )
    await click('apple')
    expect(selected('apple')).toBe('true')
    await click('pear')
    expect(selected('apple')).toBeNull()
    expect(selected('pear')).toBe('true')
    await click('plum')
    expect(selected('plum')).toBeNull()
    expect(selected('pear')).toBe('true')

    show(
      <ListBox disabled>
        <ListBoxItem value="apple">Apple</ListBoxItem>
      </ListBox>
    )
    const items = document.querySelectorAll('[data-value="apple"]')
    await act(async () => {
      ;(items[1] as HTMLElement).click()
    })
    expect(items[1]?.getAttribute('data-selected')).toBeNull()
  })

  it('moves to the next enabled option with ArrowDown and selects it with Enter', async () => {
    show(
      <ListBox>
        <ListBoxItem value="apple">Apple</ListBoxItem>
        <ListBoxItem value="plum" isDisabled>
          Plum
        </ListBoxItem>
        <ListBoxItem value="pear">Pear</ListBoxItem>
      </ListBox>
    )
    const list = document.querySelector('[data-slot="list-box"]') as HTMLElement
    const press = async (key: string) => {
      await act(async () => {
        list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    }
    await press('ArrowDown')
    expect(highlighted()).toBe('apple')
    expect(selected('apple')).toBeNull()
    await press('ArrowDown')
    expect(highlighted()).toBe('pear')
    await press('Enter')
    expect(selected('pear')).toBe('true')
    show(
      <ListBox disabled>
        <ListBoxItem value="apple">Apple</ListBoxItem>
      </ListBox>
    )
    const locked = document.querySelectorAll('[data-slot="list-box"]')[1] as HTMLElement
    await act(async () => {
      locked.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      locked.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })
    expect(locked.querySelector('[data-highlighted]')).toBeNull()
    expect(locked.querySelector('[data-selected]')).toBeNull()
  })

  it('moves the highlight with Home, End, and a letter without selecting', async () => {
    show(
      <>
        <ListBox>
          <ListBoxItem value="apple" isDisabled>
            Apple
          </ListBoxItem>
          <ListBoxItem value="pear">Pear</ListBoxItem>
          <ListBoxItem value="plum">Plum</ListBoxItem>
          <ListBoxItem value="peach">Peach</ListBoxItem>
        </ListBox>
        <ListBox disabled>
          <ListBoxItem value="pear">Pear</ListBoxItem>
        </ListBox>
      </>
    )
    const lists = () => document.querySelectorAll('[data-slot="list-box"]')
    const press = async (key: string) => {
      await act(async () => {
        ;(lists()[0] as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
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
    await act(async () => {
      ;(lists()[1] as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
    })
    expect(lists()[1]?.querySelector('[data-highlighted]')).toBeNull()
  })

  it('names an omitted list List and keeps a passed name', () => {
    show(
      <>
        <ListBox>
          <ListBoxItem value="apple">Apple</ListBoxItem>
        </ListBox>
        <ListBox aria-label="Fruits">
          <ListBoxItem value="pear">Pear</ListBoxItem>
        </ListBox>
      </>
    )
    const labels = [...document.querySelectorAll('[data-slot="list-box"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['List', 'Fruits'])
  })
})
