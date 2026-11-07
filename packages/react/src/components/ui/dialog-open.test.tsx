// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './dialog'

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

describe('dialog open', () => {
  it('follows a later open value and stays closed while the trigger is disabled', async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      const [locked, setLocked] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Show
          </button>
          <button type="button" onClick={() => setOpen(false)}>
            Hide
          </button>
          <button type="button" onClick={() => setLocked(true)}>
            Unlock
          </button>
          <Dialog open={open}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>
              <DialogTitle>Details</DialogTitle>
            </DialogContent>
          </Dialog>
          <Dialog open={locked}>
            <DialogTrigger disabled>Locked</DialogTrigger>
            <DialogContent>
              <DialogTitle>Hidden</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      )
    }
    show(<Harness />)
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="dialog-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
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
    await act(async () => {
      press('Hide')?.click()
    })
    expect(document.body.textContent).not.toContain('Details')
  })

  it('opens, closes, and stays closed while the trigger is disabled', async () => {
    const seen: boolean[] = []
    show(
      <>
        <Dialog onOpenChange={(event) => seen.push(event.detail.open)}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Details</DialogTitle>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger disabled>Locked</DialogTrigger>
          <DialogContent>
            <DialogTitle>Hidden</DialogTitle>
          </DialogContent>
        </Dialog>
      </>
    )
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="dialog-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    await act(async () => {
      trigger('Open').click()
    })
    expect(document.body.textContent).toContain('Details')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    await act(async () => {
      ;(document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement).click()
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
      <Dialog
        open={null as unknown as boolean}
        defaultOpen
        onOpenChange={(event) => seen.push(event.detail.open)}
      >
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Details</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const trigger = document.querySelector('[data-slot="dialog-trigger"]') as HTMLButtonElement
    expect(document.body.textContent).not.toContain('Details')
    await act(async () => {
      trigger.click()
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(seen).toEqual([true])
  })

  it('ignores opening while the dialog is disabled', async () => {
    const seen: boolean[] = []
    show(
      <Dialog disabled onOpenChange={(event) => seen.push(event.detail.open)}>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Details</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const trigger = document.querySelector('[data-slot="dialog-trigger"]') as HTMLButtonElement
    await act(async () => {
      trigger.click()
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(trigger.disabled).toBe(true)
    expect(seen).toEqual([])
  })

  it('drops the overlay when the dialog is not modal', () => {
    show(
      <Dialog defaultOpen modal={false}>
        <DialogContent>
          <DialogTitle>Note</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    expect(document.querySelector('[data-slot="dialog-content"]')?.getAttribute('aria-modal')).toBe('false')
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeNull()
  })

  it('keeps the overlay when the dialog is modal', () => {
    show(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Note</DialogTitle>
          <DialogDescription>More about this dialog.</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    const content = document.querySelector('[data-slot="dialog-content"]')
    const title = document.querySelector('[data-slot="dialog-title"]')
    expect(content?.getAttribute('aria-modal')).toBe('true')
    const description = document.querySelector('[data-slot="dialog-description"]')
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id)
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id)
    expect(content?.getAttribute('aria-label')).toBeNull()
    expect(document.querySelector('[data-slot="dialog-overlay"]')).not.toBeNull()
  })

  it('names an omitted dialog Dialog and keeps a passed name', () => {
    show(
      <>
        <Dialog defaultOpen>
          <DialogContent />
        </Dialog>
        <Dialog defaultOpen>
          <DialogContent aria-label="Notice" />
        </Dialog>
      </>
    )
    const labels = [...document.querySelectorAll('[data-slot="dialog-content"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Dialog', 'Notice'])
  })
})
