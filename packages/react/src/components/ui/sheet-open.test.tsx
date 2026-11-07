// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './sheet'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
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

describe('sheet open', () => {
  it('follows a later open value and stays closed while the trigger is disabled', async () => {
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
          <Sheet open={open}>
            <SheetTrigger>
              <button type="button">Open</button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Details</SheetTitle>
            </SheetContent>
          </Sheet>
          <Sheet open={locked}>
            <SheetTrigger>
              <button type="button" disabled>
                Locked
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle>Hidden</SheetTitle>
            </SheetContent>
          </Sheet>
        </>
      )
    }
    show(<Harness />)
    const trigger = (label: string) =>
      [...document.querySelectorAll('button')].find((node) => node.textContent === label) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    expect(document.body.textContent).not.toContain('Hidden')
    await act(async () => {
      trigger('Locked').click()
    })
    expect(document.body.textContent).not.toContain('Hidden')
    await act(async () => {
      trigger('Show').click()
      trigger('Unlock').click()
    })
    expect(document.body.textContent).toContain('Details')
    expect(document.body.textContent).toContain('Hidden')
  })

  it('opens, closes, and stays closed while the trigger is disabled', async () => {
    const seen: boolean[] = []
    show(
      <>
        <Sheet onOpenChange={(open) => seen.push(open)}>
          <SheetTrigger>
            <button type="button">Open</button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Details</SheetTitle>
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger>
            <button type="button" disabled>
              Locked
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Hidden</SheetTitle>
          </SheetContent>
        </Sheet>
      </>
    )
    const trigger = (label: string) =>
      [...document.querySelectorAll('button')].find((node) => node.textContent?.includes(label)) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    await act(async () => {
      trigger('Open').click()
    })
    expect(document.body.textContent).toContain('Details')
    const content = document.querySelector('[data-slot="sheet-content"]')
    expect(trigger('Open').getAttribute('aria-controls')).toBe(content?.id)
    expect(trigger('Open').getAttribute('aria-haspopup')).toBe('dialog')
    expect(content?.getAttribute('role')).toBe('dialog')
    expect(document.querySelector('[data-slot="sheet-close"] svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    await act(async () => {
      ;(document.querySelector('[data-slot="sheet-close"]') as HTMLButtonElement).click()
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      trigger('Locked').click()
    })
    expect(document.body.textContent).not.toContain('Hidden')
    expect(seen).toEqual([true, false])
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    show(
      <Sheet open={null as unknown as boolean} defaultOpen onOpenChange={(open) => seen.push(open)}>
        <SheetTrigger>
          <button type="button">Open</button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Details</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    const trigger = [...document.querySelectorAll('button')].find((node) => node.textContent === 'Open') as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    await act(async () => {
      trigger.click()
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(seen).toEqual([true])
  })

  it('ignores opening while the sheet is disabled', async () => {
    const seen: boolean[] = []
    show(
      <Sheet disabled onOpenChange={(open) => seen.push(open)}>
        <SheetTrigger>
          <button type="button">Open</button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Details</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    const trigger = [...document.querySelectorAll('button')].find((node) => node.textContent === 'Open') as HTMLButtonElement
    await act(async () => {
      trigger.click()
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(trigger.disabled).toBe(true)
    expect(seen).toEqual([])
  })
})
