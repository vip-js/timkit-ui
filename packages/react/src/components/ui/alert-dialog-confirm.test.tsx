// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

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

const click = async (selector: string) => {
  const node = document.querySelector(selector)
  if (!node) throw new Error(`missing ${selector}`)
  await act(async () => {
    ;(node as HTMLElement).click()
    await Promise.resolve()
  })
}

describe('alert dialog confirm', () => {
  it('names an omitted alert dialog Alert dialog and keeps a passed name', () => {
    show(
      <>
        <AlertDialog defaultOpen>
          <AlertDialogContent />
        </AlertDialog>
        <AlertDialog defaultOpen>
          <AlertDialogContent aria-label="Delete file" />
        </AlertDialog>
      </>
    )
    const labels = [...document.querySelectorAll('[data-slot="alert-dialog-content"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Alert dialog', 'Delete file'])
  })

  it('names the alert dialog from its title', () => {
    show(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete file</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    )
    const content = document.querySelector('[data-slot="alert-dialog-content"]')
    const title = document.querySelector('[data-slot="alert-dialog-title"]')
    const description = document.querySelector('[data-slot="alert-dialog-description"]')
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id)
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id)
    expect(content?.getAttribute('aria-label')).toBeNull()
  })

  it('opens, confirms, and ignores a disabled dialog or the backdrop', async () => {
    const confirmed: string[] = []
    show(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              confirmed.push('yes')
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeNull()
    const trigger = document.querySelector('[data-slot="alert-dialog-trigger"]') as HTMLButtonElement
    await click('[data-slot="alert-dialog-trigger"]')
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeTruthy()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await click('[data-slot="alert-dialog-overlay"]')
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeTruthy()
    await click('[data-slot="alert-dialog-action"]')
    expect(confirmed).toEqual(['yes'])
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeNull()
    expect(document.querySelector('[role="status"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)

    show(
      <AlertDialog disabled>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )
    const locked = document.querySelectorAll('[data-slot="alert-dialog-trigger"]')[1] as HTMLButtonElement
    expect(locked.disabled).toBe(true)
    act(() => {
      locked.click()
    })
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeNull()
  })

  it('stays closed when open is null even if the default is open', async () => {
    const seen: boolean[] = []
    show(
      <AlertDialog
        open={null as unknown as boolean}
        defaultOpen
        onOpenChange={(event) => seen.push(event.detail.open)}
      >
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    )
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeNull()
    const trigger = document.querySelector('[data-slot="alert-dialog-trigger"]') as HTMLButtonElement
    await act(async () => {
      trigger.click()
    })
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeNull()
    expect(seen).toEqual([true])
  })
})
