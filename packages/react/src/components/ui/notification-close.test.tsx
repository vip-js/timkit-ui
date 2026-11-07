// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Notification, NotificationIcon } from './notification'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    act(() => item.root.unmount())
    item.host.remove()
  }
  mounted.length = 0
  vi.useRealTimers()
})

const show = (node: ReactNode) => {
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  act(() => root.render(node))
  mounted.push({ root, host })
  return host
}

describe('notification close', () => {
  it('closes from the button and from the timer, and ignores a manual close when it is not closable', async () => {
    vi.useFakeTimers()
    const closed: string[] = []
    const enabled = show(
      <Notification
        duration={1000}
        onClose={() => {
          closed.push('close')
        }}
      >
        Saved
      </Notification>
    )
    expect(enabled.querySelector('[data-slot="notification"]')).toBeTruthy()
    await act(async () => {
      ;(enabled.querySelector('[data-slot="notification-close"]') as HTMLButtonElement).click()
    })
    expect(enabled.querySelector('[data-slot="notification"]')).toBeNull()
    expect(closed).toEqual(['close'])

    const timed: string[] = []
    show(
      <Notification
        duration={1000}
        closable={false}
        onClose={() => {
          timed.push('close')
        }}
      >
        Saved
      </Notification>
    )
    expect(document.querySelector('[data-slot="notification-close"]')).toBeNull()
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(document.querySelector('[data-slot="notification"]')).toBeNull()
    expect(timed).toEqual(['close'])
  })

  it('stays open until the controlled value changes and starts closed from defaultOpen', async () => {
    const seen: boolean[] = []
    function Held() {
      const [open, setOpen] = useState(true)
      return (
        <Notification
          duration={0}
          open={open}
          defaultOpen={false}
          onOpenChange={(next) => {
            seen.push(next)
            if (seen.length > 1) setOpen(next)
          }}
        >
          Saved
        </Notification>
      )
    }
    const held = show(<Held />)
    expect(held.querySelector('[data-slot="notification"]')).toBeTruthy()
    await act(async () => {
      ;(held.querySelector('[data-slot="notification-close"]') as HTMLButtonElement).click()
    })
    expect(held.querySelector('[data-slot="notification"]')).toBeTruthy()
    expect(seen).toEqual([false])
    await act(async () => {
      ;(held.querySelector('[data-slot="notification-close"]') as HTMLButtonElement).click()
    })
    expect(held.querySelector('[data-slot="notification"]')).toBeNull()

    const preset = show(
      <Notification duration={0} defaultOpen={false}>
        Saved
      </Notification>
    )
    expect(preset.querySelector('[data-slot="notification"]')).toBeNull()
  })

  it('hides the icon from the notification name', () => {
    show(
      <Notification>
        <NotificationIcon>!</NotificationIcon>
        Saved
      </Notification>
    )
    expect(document.querySelector('[data-slot="notification-icon"]')?.getAttribute('aria-hidden')).toBe('true')
  })
})
