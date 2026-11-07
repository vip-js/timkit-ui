// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

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
  const trigger = document.querySelector('[data-slot="tooltip-trigger"]')
  act(() => {
    trigger?.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
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

const hover = async () => {
  const trigger = document.querySelector('[data-slot="tooltip-trigger"]') as HTMLElement
  await act(async () => {
    trigger.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
  })
}

describe('tooltip delayDuration', () => {
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
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              setLocked(false)
            }}
          >
            Reset
          </button>
          <Tooltip open={open} delayDuration={700}>
            <TooltipTrigger>Hint</TooltipTrigger>
            <TooltipContent>Details</TooltipContent>
          </Tooltip>
          <Tooltip open={locked} disabled delayDuration={700}>
            <TooltipTrigger>Locked</TooltipTrigger>
            <TooltipContent>Hidden</TooltipContent>
          </Tooltip>
        </>
      )
    }
    show(<Harness />)
    const trigger = (label: string) =>
      [...document.querySelectorAll('[data-slot="tooltip-trigger"]')].find((node) =>
        node.textContent?.includes(label)
      ) as HTMLElement
    expect(document.body.textContent).not.toContain('Details')
    expect(document.body.textContent).not.toContain('Hidden')
    await act(async () => {
      trigger('Locked').dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
      vi.advanceTimersByTime(700)
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
      press('Reset')?.click()
    })
  })

  it('keeps the tooltip closed until the requested delay elapses', async () => {
    vi.useFakeTimers()
    show(
      <Tooltip delayDuration={700} openDelay={2000}>
        <TooltipTrigger>Hint</TooltipTrigger>
        <TooltipContent>Details</TooltipContent>
      </Tooltip>
    )
    await hover()
    await act(async () => {
      vi.advanceTimersByTime(699)
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(document.querySelector('[role="status"]')).toBeNull()
    await act(async () => {
      vi.advanceTimersByTime(1)
    })
    expect(document.body.textContent).toContain('Details')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    const hint = document.querySelector('[data-slot="tooltip-trigger"]')
    const content = document.querySelector('[data-slot="tooltip-content"]')
    expect(content?.getAttribute('role')).toBe('tooltip')
    expect(hint?.getAttribute('aria-describedby')).toBe(content?.id)
  })
})
