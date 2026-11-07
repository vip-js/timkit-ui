// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './dropdown-menu'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
const cssEscape = (value: string) => String(value).replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`)
if (typeof globalThis.CSS === 'undefined') {
  globalThis.CSS = { escape: cssEscape, supports: () => false } as unknown as typeof CSS
} else if (typeof CSS.escape !== 'function') {
  CSS.escape = cssEscape
}

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

const state = (slot: string) => document.querySelector(`[data-slot="${slot}"]`)?.getAttribute('data-state')

describe('dropdown menu selection', () => {
  it('follows a later open value and ignores a disabled trigger', async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      const [locked, setLocked] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Show
          </button>
          <button type="button" onClick={() => setLocked(true)}>
            Unlock
          </button>
          <DropdownMenu open={open}>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>Details</DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu open={locked}>
            <DropdownMenuTrigger disabled>Locked</DropdownMenuTrigger>
            <DropdownMenuContent>Hidden</DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }
    show(<Harness />)
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="dropdown-menu-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    expect(document.body.textContent).not.toContain('Hidden')
    await act(async () => {
      trigger('Locked').click()
    })
    expect(document.body.textContent).not.toContain('Hidden')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      press('Show')?.click()
      press('Unlock')?.click()
    })
    expect(document.body.textContent).toContain('Details')
    expect(document.body.textContent).toContain('Hidden')
    const menu = [...document.querySelectorAll('[role="menu"]')].find((node) => node.textContent?.includes('Details'))
    expect(menu?.getAttribute('aria-labelledby')).toBe(trigger('Open').id)
    expect(trigger('Open').getAttribute('aria-controls')).toBe(menu?.id)
    expect(trigger('Open').getAttribute('aria-haspopup')).toBe('menu')
  })

  it('toggles a checkbox, replaces a radio, and ignores disabled items', async () => {
    show(
      <DropdownMenu defaultOpen closeOnSelect={false}>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem>Bold</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem disabled>Italic</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup>
            <DropdownMenuRadioItem value="apple">Apple</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pear">Pear</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="plum" disabled>
              Plum
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const boxes = document.querySelectorAll('[data-slot="dropdown-menu-checkbox-item"]')
    const radios = document.querySelectorAll('[data-slot="dropdown-menu-radio-item"]')
    await act(async () => {
      ;(boxes[0] as HTMLElement).click()
    })
    expect(boxes[0]?.getAttribute('data-state')).toBe('checked')
    await act(async () => {
      ;(boxes[0] as HTMLElement).click()
      ;(boxes[1] as HTMLElement).click()
    })
    expect(boxes[0]?.getAttribute('data-state')).toBe('unchecked')
    expect(boxes[1]?.getAttribute('data-state')).toBe('unchecked')
    await act(async () => {
      ;(radios[0] as HTMLElement).click()
    })
    expect(radios[0]?.textContent).toContain('Apple')
    expect(state('dropdown-menu-radio-item')).toBe('checked')
    await act(async () => {
      ;(radios[1] as HTMLElement).click()
      ;(radios[2] as HTMLElement).click()
    })
    expect(radios[0]?.getAttribute('data-state')).not.toBe('checked')
    expect(radios[1]?.getAttribute('data-state')).toBe('checked')
    expect(radios[2]?.getAttribute('data-state')).not.toBe('checked')
  })

  it('stays empty when value is null even if the default is apple', async () => {
    const seen: string[] = []
    show(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={null as unknown as string}
            defaultValue="apple"
            onValueChange={(value) => seen.push(value)}
          >
            <DropdownMenuRadioItem value="apple">Apple</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pear">Pear</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const radios = document.querySelectorAll('[data-slot="dropdown-menu-radio-item"]')
    expect(radios[0]?.getAttribute('data-state')).not.toBe('checked')
    expect(radios[1]?.getAttribute('data-state')).not.toBe('checked')
    await act(async () => {
      ;(radios[1] as HTMLElement).click()
    })
    expect(radios[0]?.getAttribute('data-state')).not.toBe('checked')
    expect(radios[1]?.getAttribute('data-state')).not.toBe('checked')
    expect(seen.at(-1)).toBe('pear')
  })

  it('stays unchecked when checked is null and a click only requests a check', async () => {
    const seen: boolean[] = []
    function Harness() {
      const [checked, setChecked] = useState<boolean | null>(true)
      return (
        <>
          <button type="button" onClick={() => setChecked(null)}>
            Clear
          </button>
          <DropdownMenu defaultOpen closeOnSelect={false}>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={checked as boolean}
                onCheckedChange={(next) => seen.push(next)}
              >
                Bold
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )
    }
    show(<Harness />)
    const box = () => document.querySelector('[data-slot="dropdown-menu-checkbox-item"]')
    expect(box()?.getAttribute('data-state')).toBe('checked')
    const clear = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Clear')
    await act(async () => {
      clear?.click()
    })
    expect(box()?.getAttribute('data-state')).toBe('unchecked')
    await act(async () => {
      ;(box() as HTMLElement).click()
    })
    expect(box()?.getAttribute('data-state')).toBe('unchecked')
    expect(seen.at(-1)).toBe(true)
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    show(
      <DropdownMenu
        open={null as unknown as boolean}
        defaultOpen
        onOpenChange={(open) => seen.push(open)}
      >
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>Details</DropdownMenuContent>
      </DropdownMenu>
    )
    expect(document.body.textContent).not.toContain('Details')
    await act(async () => {
      ;(document.querySelector('[data-slot="dropdown-menu-trigger"]') as HTMLButtonElement).click()
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(seen.at(-1)).toBe(true)
  })

  it('ignores opening and selection while the menu is disabled', async () => {
    const opened: boolean[] = []
    const selected: string[] = []
    show(
      <>
        <DropdownMenu disabled onOpenChange={(open) => opened.push(open)}>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>Details</DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu defaultOpen disabled onSelect={(value) => selected.push(value)}>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem value="save" onSelect={() => selected.push('save')}>
              Save
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
    const trigger = document.querySelector('[data-slot="dropdown-menu-trigger"]') as HTMLButtonElement
    await act(async () => {
      trigger.click()
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(trigger.disabled).toBe(true)
    expect(opened).toEqual([])
    const item = [...document.querySelectorAll('[data-slot="dropdown-menu-item"]')].find((node) =>
      node.textContent?.includes('Save')
    ) as HTMLElement
    await act(async () => {
      item.click()
    })
    expect(selected).toEqual([])
  })

  it('jumps to the first and last enabled item with Home and End without selecting them', async () => {
    show(
      <>
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem value="pear">Pear</DropdownMenuItem>
            <DropdownMenuItem value="apple" disabled>
              Apple
            </DropdownMenuItem>
            <DropdownMenuItem value="plum">Plum</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>Closed</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem value="pear">Pear</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
    const menus = () => document.querySelectorAll('[data-slot="dropdown-menu-content"]')
    const highlighted = () => document.querySelector('[data-slot="dropdown-menu-item"][data-highlighted]')?.textContent
    const menu = menus()[0] as HTMLElement
    await act(async () => {
      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    })
    expect(highlighted()).toContain('Plum')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 3 of 3')
    expect(document.body.textContent).toContain('Apple')
    await act(async () => {
      menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    })
    expect(highlighted()).toContain('Pear')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Item 1 of 3')
    expect(menus()).toHaveLength(1)
    const closed = [...document.querySelectorAll('[data-slot="dropdown-menu-trigger"]')].find((node) =>
      node.textContent?.includes('Closed')
    ) as HTMLButtonElement
    await act(async () => {
      closed.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    })
    expect(menus()).toHaveLength(1)
  })

  it('moves to the next enabled item whose label starts with a letter without selecting it', async () => {
    show(
      <>
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem value="pear">Pear</DropdownMenuItem>
            <DropdownMenuItem value="apple" disabled>
              Apple
            </DropdownMenuItem>
            <DropdownMenuItem value="plum">Plum</DropdownMenuItem>
            <DropdownMenuItem value="peach">Peach</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>Closed</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem value="pear">Pear</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
    const menus = () => document.querySelectorAll('[data-slot="dropdown-menu-content"]')
    const highlighted = () => document.querySelector('[data-highlighted]')?.textContent
    const menu = menus()[0] as HTMLElement
    const press = (key: string) =>
      act(async () => {
        menu.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
      })
    await press('p')
    const first = highlighted()
    await press('p')
    const second = highlighted()
    await press('p')
    const third = highlighted()
    expect([first, second, third].map((text) => text?.trim())).toEqual(['Pear', 'Plum', 'Peach'])
    await press('z')
    expect(highlighted()?.trim()).toBe('Peach')
    expect(menus()).toHaveLength(1)
    const closed = [...document.querySelectorAll('[data-slot="dropdown-menu-trigger"]')].find((node) =>
      node.textContent?.includes('Closed')
    ) as HTMLButtonElement
    await act(async () => {
      closed.focus()
      closed.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
    })
    expect(menus()).toHaveLength(1)
  })

  it('hides the shortcut from the item name', () => {
    show(<DropdownMenuShortcut>⌘P</DropdownMenuShortcut>)
    expect(document.querySelector('[data-slot="dropdown-menu-shortcut"]')?.getAttribute('aria-hidden')).toBe('true')
    expect(document.querySelector('[data-slot="dropdown-menu-shortcut"]')?.textContent).toBe('⌘P')
  })
})
