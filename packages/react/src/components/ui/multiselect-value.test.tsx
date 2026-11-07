// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { MultipleSelector } from './multiselect'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
Element.prototype.scrollIntoView = () => {}
Element.prototype.scrollTo = () => {}

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

const options = [
  { value: 'pear', label: 'Pear' },
  { value: 'apple', label: 'Apple', disable: true },
]

const tags = (root: Element) =>
  [...root.querySelectorAll('button[aria-label="Remove"]')].map((button) => button.parentElement?.textContent ?? '')

describe('multiselect value', () => {
  it('follows a later value and keeps a disabled field closed', async () => {
    function Harness() {
      const [value, setValue] = useState([{ value: 'pear', label: 'Pear' }])
      const [locked, setLocked] = useState([{ value: 'pear', label: 'Pear' }])
      return (
        <>
          <button
            type="button"
            onClick={() =>
              setValue([
                { value: 'pear', label: 'Pear' },
                { value: 'apple', label: 'Apple' },
              ])
            }
          >
            Both
          </button>
          <button type="button" onClick={() => setValue([{ value: 'plum', label: 'Plum' }])}>
            Replace
          </button>
          <button type="button" onClick={() => setLocked([])}>
            Clear
          </button>
          <MultipleSelector value={value} defaultOptions={options} />
          <MultipleSelector disabled value={locked} defaultOptions={options} />
        </>
      )
    }
    show(<Harness />)
    const roots = () => document.querySelectorAll('[data-slot="multiselect"]')
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    expect(roots()[0]?.textContent).toContain('Pear')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Option 1 of 2',
      'Option 1 of 2',
    ])
    await act(async () => {
      click('Both')?.click()
    })
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      '2 options selected',
      'Option 1 of 2',
    ])
    expect((roots()[1]?.querySelector('input') as HTMLInputElement).disabled).toBe(true)
    await act(async () => {
      click('Replace')?.click()
      click('Clear')?.click()
    })
    expect(roots()[0]?.textContent).toContain('Plum')
    expect(roots()[0]?.textContent).not.toContain('Pear')
    expect(roots()[1]?.textContent).not.toContain('Pear')
    expect(document.querySelector('[role="status"]')).toBeNull()
    expect((roots()[1]?.querySelector('input') as HTMLInputElement).disabled).toBe(true)
  })

  it('stays empty when the value is null and a click only requests a selection', async () => {
    const seen: string[][] = []
    function Harness() {
      const [value, setValue] = useState<Array<{ value: string; label: string }> | null>([
        { value: 'pear', label: 'Pear' },
      ])
      return (
        <>
          <button type="button" onClick={() => setValue(null)}>
            Clear
          </button>
          <MultipleSelector
            value={value}
            defaultOptions={options}
            onValueChange={(next) => seen.push(next.map((option) => option.value))}
          />
        </>
      )
    }
    show(<Harness />)
    const root = () => document.querySelector('[data-slot="multiselect"]') as HTMLElement
    expect(root().textContent).toContain('Pear')
    const click = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      click('Clear')?.click()
    })
    expect(tags(root()).join(' ')).not.toContain('Pear')
    const input = root().querySelector('input') as HTMLInputElement
    await act(async () => {
      input.focus()
    })
    const apple = [...document.querySelectorAll('[data-slot="command-item"]')].find((item) =>
      item.textContent?.includes('Apple')
    ) as HTMLElement
    const plum = [...document.querySelectorAll('[data-slot="command-item"]')].find(
      (item) => item.textContent?.includes('Pear')
    ) as HTMLElement
    await act(async () => {
      plum.click()
    })
    expect(tags(root()).join(' ')).not.toContain('Pear')
    expect(seen.at(-1)).toEqual(['pear'])
    expect(apple).toBeTruthy()
  })

  it('selects an option, ignores a disabled option, and stays closed when the field is disabled', async () => {
    const seen: string[][] = []
    show(
      <>
        <MultipleSelector
          defaultOptions={options}
          onValueChange={(next) => seen.push(next.map((option) => option.value))}
        />
        <MultipleSelector disabled defaultOptions={[{ value: 'locked', label: 'Locked' }]} />
      </>
    )
    const roots = document.querySelectorAll('[data-slot="multiselect"]')
    const input = roots[0]?.querySelector('input') as HTMLInputElement
    await act(async () => {
      input.focus()
    })
    const pear = [...document.querySelectorAll('[data-slot="command-item"]')].find((item) =>
      item.textContent?.includes('Pear')
    ) as HTMLElement
    const apple = [...document.querySelectorAll('[data-slot="command-item"]')].find((item) =>
      item.textContent?.includes('Apple')
    ) as HTMLElement
    await act(async () => {
      pear.click()
    })
    expect(tags(roots[0] as Element).join(' ')).toContain('Pear')
    await act(async () => {
      apple.click()
    })
    expect(tags(roots[0] as Element).join(' ')).not.toContain('Apple')
    expect(seen).toEqual([['pear']])
    const locked = roots[1]?.querySelector('input') as HTMLInputElement
    expect(locked.disabled).toBe(true)
    await act(async () => {
      locked.focus()
      ;(roots[1] as HTMLElement).click()
    })
    expect(document.body.textContent).not.toContain('Locked')
  })

  it('stays closed while open is false and follows a later open value', async () => {
    const seen: boolean[] = []
    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <MultipleSelector
            open={open}
            defaultOpen
            defaultOptions={options}
            onOpenChange={(next) => seen.push(next)}
          />
        </>
      )
    }
    show(<Harness />)
    const list = () => document.querySelector('[data-slot="multiselect-popup"]')
    expect(list()?.getAttribute('data-state')).toBe('closed')
    const input = document.querySelector('[data-slot="multiselect"] input') as HTMLInputElement
    await act(async () => {
      input.focus()
    })
    expect(list()?.getAttribute('data-state')).toBe('closed')
    expect(seen).toEqual([true])
    const openButton = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Open')
    await act(async () => {
      openButton?.click()
    })
    expect(list()?.getAttribute('data-state')).toBe('open')
  })

  it('closes on Escape and keeps focus on the field', async () => {
    show(<MultipleSelector defaultOptions={options} />)
    const input = document.querySelector('[data-slot="multiselect"] input') as HTMLInputElement
    await act(async () => {
      input.focus()
    })
    const list = () => document.querySelector('[data-slot="multiselect-popup"]')
    expect(list()?.getAttribute('data-state')).toBe('open')
    await act(async () => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })
    expect(list()?.getAttribute('data-state')).toBe('closed')
    expect(document.activeElement).toBe(input)
  })
})
