// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
Element.prototype.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

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

const item = (label: string) =>
  [...document.querySelectorAll('[data-slot="select-item"]')].find((node) => node.textContent?.includes(label)) as HTMLElement

describe('select value', () => {
  it('follows a later value and keeps a disabled field closed', async () => {
    function Harness() {
      const [value, setValue] = useState('pear')
      const [locked, setLocked] = useState('pear')
      return (
        <>
          <button type="button" onClick={() => setValue('plum')}>
            Next
          </button>
          <button type="button" onClick={() => setLocked('')}>
            Clear
          </button>
          <Select value={value}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pear">Pear</SelectItem>
              <SelectItem value="plum">Plum</SelectItem>
            </SelectContent>
          </Select>
          <Select disabled value={locked}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pear">Pear</SelectItem>
            </SelectContent>
          </Select>
        </>
      )
    }
    show(<Harness />)
    const triggers = () => document.querySelectorAll('[data-slot="select-trigger"]')
    expect(triggers()[0]?.textContent).toContain('Pear')
    expect(triggers()[0]?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(triggers()[1]?.textContent).toContain('Pear')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Option 1 of 2',
      'Option 1 of 1',
    ])
    await act(async () => {
      ;(triggers()[1] as HTMLButtonElement).click()
    })
    expect(triggers()[1]?.getAttribute('aria-expanded')).not.toBe('true')
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      click('Next')?.click()
      click('Clear')?.click()
    })
    expect(triggers()[0]?.textContent).toContain('Plum')
    expect(triggers()[1]?.textContent).not.toContain('Pear')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual(['Option 2 of 2'])
  })

  it('opens, selects an item, and ignores a disabled item or a disabled field', async () => {
    const seen: string[][] = []
    show(
      <>
        <Select onValueChange={(event) => seen.push(event.detail.value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pick" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pear">Pear</SelectItem>
            <SelectItem value="apple" disabled>
              Apple
            </SelectItem>
          </SelectContent>
        </Select>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Locked" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pear">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </>
    )
    const triggers = () => document.querySelectorAll('[data-slot="select-trigger"]')
    expect(triggers()[0]?.textContent).toContain('Pick')
    await act(async () => {
      ;(triggers()[0] as HTMLButtonElement).click()
    })
    await act(async () => {
      item('Pear').click()
    })
    expect(triggers()[0]?.textContent).toContain('Pear')
    await act(async () => {
      item('Apple').click()
    })
    expect(triggers()[0]?.textContent).toContain('Pear')
    expect(seen.map((value) => value[0])).toEqual(['pear'])
    await act(async () => {
      ;(triggers()[1] as HTMLButtonElement).click()
    })
    expect(triggers()[1]?.textContent).toContain('Locked')
    expect(triggers()[1]?.textContent).not.toContain('Hidden')
  })

  it('stays empty when value is null even if the default is pear', async () => {
    const seen: string[][] = []
    show(
      <Select
        value={null}
        defaultValue="pear"
        onValueChange={(event) => seen.push(event.detail.value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pear">Pear</SelectItem>
        </SelectContent>
      </Select>
    )
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    expect(trigger.textContent).not.toContain('Pear')
    await act(async () => {
      trigger.click()
    })
    await act(async () => {
      item('Pear').click()
    })
    expect(trigger.textContent).not.toContain('Pear')
    expect(seen.map((value) => value[0])).toEqual(['pear'])
  })

  it('ignores opening while the select is read-only', async () => {
    show(
      <Select readOnly defaultValue="apple">
        <SelectTrigger>
          <SelectValue placeholder="Locked" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pear">Pear</SelectItem>
        </SelectContent>
      </Select>
    )
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await act(async () => {
      trigger.click()
    })
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    await act(async () => {
      item('Pear').click()
    })
    expect(trigger.getAttribute('aria-expanded')).not.toBe('true')
    expect(trigger.textContent).not.toContain('Pear')
  })

  it('jumps to the first and last enabled option with Home and End', async () => {
    show(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pear">Pear</SelectItem>
          <SelectItem value="apple" disabled>
            Apple
          </SelectItem>
          <SelectItem value="plum">Plum</SelectItem>
        </SelectContent>
      </Select>
    )
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
    await act(async () => {
      trigger.click()
    })
    const list = document.querySelector('[role="listbox"]') as HTMLElement
    const highlighted = () =>
      document.querySelector('[data-slot="select-item"][data-highlighted]')?.getAttribute('data-value')
    const press = (key: string) =>
      act(async () => {
        list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    await press('End')
    expect(highlighted()).toBe('plum')
    await press('Home')
    expect(highlighted()).toBe('pear')
    expect(trigger.textContent).not.toContain('Plum')
    expect(trigger.textContent).not.toContain('Pear')
  })

  it('moves to the next matching option with a letter and selects it only while closed', async () => {
    show(
      <>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pick" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pear">Pear</SelectItem>
            <SelectItem value="apple" disabled>
              Apple
            </SelectItem>
            <SelectItem value="plum">Plum</SelectItem>
            <SelectItem value="peach">Peach</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Closed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pear">Pear</SelectItem>
            <SelectItem value="apple" disabled>
              Apple
            </SelectItem>
            <SelectItem value="plum">Plum</SelectItem>
            <SelectItem value="peach">Peach</SelectItem>
          </SelectContent>
        </Select>
        <Select readOnly>
          <SelectTrigger>
            <SelectValue placeholder="Frozen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pear">Pear</SelectItem>
          </SelectContent>
        </Select>
      </>
    )
    const triggers = () => document.querySelectorAll('[data-slot="select-trigger"]')
    const highlighted = () =>
      document.querySelector('[data-slot="select-item"][data-highlighted]')?.getAttribute('data-value')
    await act(async () => {
      ;(triggers()[0] as HTMLButtonElement).click()
    })
    const list = document.querySelector('[role="listbox"]') as HTMLElement
    const pressList = (key: string) =>
      act(async () => {
        list.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    await pressList('p')
    expect(highlighted()).toBe('pear')
    await pressList('p')
    expect(highlighted()).toBe('plum')
    await pressList('p')
    expect(highlighted()).toBe('peach')
    await pressList('z')
    expect(highlighted()).toBe('peach')
    expect(triggers()[0]?.textContent).toContain('Pick')
    const pressTrigger = (index: number, key: string) =>
      act(async () => {
        const trigger = triggers()[index] as HTMLButtonElement
        trigger.focus()
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    await pressTrigger(1, 'p')
    expect(triggers()[1]?.textContent).toContain('Pear')
    expect(triggers()[1]?.getAttribute('aria-expanded')).not.toBe('true')
    await pressTrigger(1, 'p')
    expect(triggers()[1]?.textContent).toContain('Plum')
    await pressTrigger(2, 'p')
    expect(triggers()[2]?.textContent).toContain('Frozen')
  })

  it('selects the first and last enabled option with Home and End while closed', async () => {
    show(
      <>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pick" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple" disabled>
              Apple
            </SelectItem>
            <SelectItem value="pear">Pear</SelectItem>
            <SelectItem value="plum">Plum</SelectItem>
          </SelectContent>
        </Select>
        <Select readOnly>
          <SelectTrigger>
            <SelectValue placeholder="Frozen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pear">Pear</SelectItem>
          </SelectContent>
        </Select>
      </>
    )
    const triggers = () => document.querySelectorAll('[data-slot="select-trigger"]')
    const press = (index: number, key: string) =>
      act(async () => {
        const trigger = triggers()[index] as HTMLButtonElement
        trigger.focus()
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    await press(0, 'Home')
    expect(triggers()[0]?.textContent).toContain('Pear')
    expect(triggers()[0]?.getAttribute('aria-expanded')).not.toBe('true')
    await press(0, 'End')
    expect(triggers()[0]?.textContent).toContain('Plum')
    expect(triggers()[0]?.getAttribute('aria-expanded')).not.toBe('true')
    await press(1, 'End')
    expect(triggers()[1]?.textContent).toContain('Frozen')
  })
})
