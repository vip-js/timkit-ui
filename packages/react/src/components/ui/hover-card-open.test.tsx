// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
globalThis.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(0)
  return 1
}
globalThis.cancelAnimationFrame = () => {}

const mounted: Array<{ root: Root; host: HTMLElement }> = []

afterEach(() => {
  const trigger = document.querySelector('[data-slot="hover-card-trigger"]')
  act(() => {
    trigger?.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, pointerType: 'mouse' }))
    vi.advanceTimersByTime(1000)
  })
  vi.useRealTimers()
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

const enter = async () => {
  const trigger = document.querySelector('[data-slot="hover-card-trigger"]') as HTMLElement
  await act(async () => {
    trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
  })
}

describe('hover card open', () => {
  it('follows a later open value and stays closed while disabled', async () => {
    vi.useFakeTimers()
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
          <HoverCard open={open} openDelay={40}>
            <HoverCardTrigger>Preview</HoverCardTrigger>
            <HoverCardContent>Card body</HoverCardContent>
          </HoverCard>
          <HoverCard open={locked} disabled openDelay={40}>
            <HoverCardTrigger>Locked</HoverCardTrigger>
            <HoverCardContent>Hidden body</HoverCardContent>
          </HoverCard>
        </>
      )
    }
    show(<Harness />)
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="hover-card-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLElement
    expect(document.body.textContent).not.toContain('Card body')
    expect(document.body.textContent).not.toContain('Hidden body')
    await act(async () => {
      trigger('Locked').dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
      vi.advanceTimersByTime(40)
    })
    expect(document.body.textContent).not.toContain('Hidden body')
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    await act(async () => {
      press('Show')?.click()
      press('Unlock')?.click()
    })
    expect(document.body.textContent).toContain('Card body')
    expect(document.body.textContent).toContain('Hidden body')
    const content = [...document.querySelectorAll('[data-slot="hover-card-content"]')].find((node) =>
      node.textContent?.includes('Card body')
    )
    expect(trigger('Preview').getAttribute('aria-describedby')).toBe(content?.id)
    expect(content?.getAttribute('role')).toBeNull()
  })

  it('opens after the delay and stays closed while disabled', async () => {
    vi.useFakeTimers()
    show(
      <HoverCard openDelay={40} closeDelay={20}>
        <HoverCardTrigger>Preview</HoverCardTrigger>
        <HoverCardContent>Card body</HoverCardContent>
      </HoverCard>
    )
    await enter()
    await act(async () => {
      vi.advanceTimersByTime(39)
    })
    expect(document.body.textContent).not.toContain('Card body')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      vi.advanceTimersByTime(1)
    })
    expect(document.body.textContent).toContain('Card body')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')

    show(
      <HoverCard openDelay={40} disabled>
        <HoverCardTrigger>Preview</HoverCardTrigger>
        <HoverCardContent>Hidden body</HoverCardContent>
      </HoverCard>
    )
    const triggers = document.querySelectorAll('[data-slot="hover-card-trigger"]')
    await act(async () => {
      triggers[1]?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
      vi.advanceTimersByTime(40)
    })
    expect(document.body.textContent).not.toContain('Hidden body')
  })
})
