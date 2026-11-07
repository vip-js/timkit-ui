// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Command, CommandEmpty, CommandInput, CommandItem, CommandList, CommandShortcut } from './command'

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

function Palette() {
  const [selected, setSelected] = useState('')
  return (
    <Command>
      <CommandList>
        <CommandItem value="open" onSelect={() => setSelected('open')}>
          Open
        </CommandItem>
        <CommandItem value="close" disabled onSelect={() => setSelected('close')}>
          Close
        </CommandItem>
      </CommandList>
      <span data-picked={selected} />
    </Command>
  )
}

describe('command selection', () => {
  it('follows a later value and ignores a disabled item', async () => {
    function Harness() {
      const [value, setValue] = useState('open')
      const [locked, setLocked] = useState('open')
      return (
        <>
          <button type="button" onClick={() => setValue('save')}>
            Next
          </button>
          <button type="button" onClick={() => setLocked('')}>
            Clear
          </button>
          <Command value={value}>
            <CommandList>
              <CommandItem value="open">Open</CommandItem>
              <CommandItem value="save">Save</CommandItem>
              <CommandItem value="close" disabled>
                Close
              </CommandItem>
            </CommandList>
          </Command>
          <Command value={locked}>
            <CommandList>
              <CommandItem value="open" disabled>
                Locked
              </CommandItem>
              <CommandItem value="save" disabled>
                Other
              </CommandItem>
            </CommandList>
          </Command>
        </>
      )
    }
    show(<Harness />)
    const item = (label: string) =>
      [...document.querySelectorAll('[data-slot="command-item"]')].find((node) => node.textContent?.includes(label))
    expect(item('Open')?.getAttribute('data-selected')).toBe('true')
    expect(item('Locked')?.getAttribute('data-selected')).toBe('true')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual([
      'Item 1 of 3',
      'Item 1 of 2',
    ])
    await act(async () => {
      ;(item('Close') as HTMLElement).click()
      ;(item('Other') as HTMLElement).click()
    })
    expect(item('Open')?.getAttribute('data-selected')).toBe('true')
    expect(item('Locked')?.getAttribute('data-selected')).toBe('true')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      press('Next')?.click()
      press('Clear')?.click()
    })
    expect(item('Save')?.getAttribute('data-selected')).toBe('true')
    expect(item('Open')?.getAttribute('data-selected')).not.toBe('true')
    expect(item('Locked')?.getAttribute('data-selected')).not.toBe('true')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toEqual(['Item 2 of 3'])
  })

  it('selects an item and ignores a disabled item', async () => {
    show(<Palette />)
    const items = document.querySelectorAll('[data-slot="command-item"]')
    await act(async () => {
      ;(items[0] as HTMLElement).click()
    })
    expect(document.querySelector('[data-picked]')?.getAttribute('data-picked')).toBe('open')
    await act(async () => {
      ;(items[1] as HTMLElement).click()
    })
    expect(document.querySelector('[data-picked]')?.getAttribute('data-picked')).toBe('open')
  })

  it('ignores selection while the palette is disabled', async () => {
    const seen: string[] = []
    show(
      <Command disabled>
        <CommandList>
          <CommandItem value="open" onSelect={() => seen.push('open')}>
            Open
          </CommandItem>
        </CommandList>
      </Command>
    )
    const item = document.querySelector('[data-slot="command-item"]') as HTMLElement
    expect(document.querySelector('[data-slot="command"]')?.getAttribute('aria-disabled')).toBe('true')
    expect(item.getAttribute('aria-disabled')).toBe('true')
    await act(async () => {
      item.click()
    })
    expect(seen).toEqual([])
  })

  it('filters the list and shows the empty state when nothing matches', async () => {
    show(
      <Command>
        <CommandInput />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandItem value="open">Open</CommandItem>
          <CommandItem value="save">Save</CommandItem>
        </CommandList>
      </Command>
    )
    const item = (label: string) =>
      [...document.querySelectorAll('[data-slot="command-item"]')].find((node) => node.textContent?.includes(label))
    expect(item('Open')).toBeTruthy()
    expect(item('Save')).toBeTruthy()
    expect(document.querySelector('[role="status"]')).toBeNull()
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.getAttribute('aria-label')).toBe('Command menu')
    const key = Object.keys(input).find((name) => name.startsWith('__reactProps'))
    const props = key
      ? (input as unknown as Record<string, Record<string, (event: object) => void>>)[key]
      : undefined
    const change = props?.onChange ?? props?.onInput
    if (!change) throw new Error(`missing command input handlers: ${Object.keys(props ?? {}).sort().join(',')}`)
    const typeQuery = async (text: string) => {
      input.value = text
      await act(async () => {
        change({ currentTarget: input, target: input, value: text })
        await Promise.resolve()
      })
    }
    await typeQuery('sa')
    expect(item('Save')).toBeTruthy()
    expect(item('Open')).toBeFalsy()
    expect(document.querySelector('[role="status"]')).toBeNull()
    await typeQuery('zzz')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('No results')
    expect(item('Open')).toBeFalsy()
    expect(item('Save')).toBeFalsy()
  })

  it('names an omitted list Suggestions', () => {
    show(
      <Command>
        <CommandInput />
        <CommandList>
          <CommandItem value="open">Open</CommandItem>
        </CommandList>
      </Command>
    )
    expect(document.querySelector('[data-slot="command-list"]')?.getAttribute('aria-label')).toBe('Suggestions')
  })

  it('hides the shortcut from the option name', () => {
    show(
      <Command>
        <CommandList>
          <CommandItem value="open">
            Open
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    )
    expect(document.querySelector('[data-slot="command-shortcut"]')?.getAttribute('aria-hidden')).toBe('true')
    expect(document.querySelector('[data-slot="command-shortcut"]')?.textContent).toBe('⌘S')
  })
})
