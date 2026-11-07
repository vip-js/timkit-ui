// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Toast, ToastClose } from './toast'

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

describe('toast contract', () => {
  it('uses the destructive style and closes through onOpenChange', () => {
    const changes: boolean[] = []
    const Harness = () => {
      const [open, setOpen] = useState(true)
      return (
        <Toast
          variant="destructive"
          open={open}
          onOpenChange={(next) => {
            changes.push(next)
            setOpen(next)
          }}
        >
          <ToastClose />
          Removed
        </Toast>
      )
    }
    show(<Harness />)
    const toast = document.querySelector('[data-slot="toast"]')
    expect(document.querySelector('button')?.getAttribute('aria-label')).toBe('Close')
    expect(document.querySelector('button svg')?.getAttribute('aria-hidden')).toBe('true')
    expect(toast?.className).toContain('bg-destructive')
    expect(toast?.getAttribute('data-state')).toBe('open')
    act(() => {
      document.querySelector('button')?.click()
    })
    expect(changes).toEqual([false])
    expect(document.querySelector('[data-slot="toast"]')).toBeNull()
  })

  it('follows a later open value', () => {
    const Harness = () => {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button type="button" onClick={() => setOpen(false)}>
            Hide
          </button>
          <button type="button" onClick={() => setOpen(true)}>
            Show
          </button>
          <Toast open={open}>Saved</Toast>
        </>
      )
    }
    show(<Harness />)
    expect(document.querySelector('[data-slot="toast"]')?.textContent).toContain('Saved')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    act(() => press('Hide')?.click())
    expect(document.querySelector('[data-slot="toast"]')).toBeNull()
    expect(document.querySelector('[role="status"]')).toBeNull()
    act(() => press('Show')?.click())
    expect(document.querySelector('[data-slot="toast"]')?.textContent).toContain('Saved')
  })

  it('stays visible when open is omitted and hides when open is false', () => {
    show(<Toast>Saved</Toast>)
    expect(document.querySelector('[data-slot="toast"]')?.getAttribute('data-state')).toBe('open')
    show(<Toast open={false}>Saved</Toast>)
    expect(document.querySelectorAll('[data-slot="toast"]')).toHaveLength(1)
  })
})
