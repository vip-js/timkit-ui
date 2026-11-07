// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

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

const trigger = (index: number) => document.querySelectorAll('[data-slot="tooltip-trigger"]')[index] as HTMLElement

const hover = async (index: number) => {
  await act(async () => {
    trigger(index).dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }))
  })
}

const leave = async (index: number) => {
  await act(async () => {
    trigger(index).dispatchEvent(new PointerEvent('pointerleave', { bubbles: true, pointerType: 'mouse' }))
  })
}

describe('tooltip group', () => {
  it('opens the next tooltip immediately and keeps content hoverable when asked', async () => {
    vi.useFakeTimers()
    show(
      <TooltipProvider delayDuration={700} skipDelayDuration={500} disableHoverableContent={false}>
        <Tooltip>
          <TooltipTrigger>One</TooltipTrigger>
          <TooltipContent>First</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>Two</TooltipTrigger>
          <TooltipContent>Second</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    await hover(0)
    await act(async () => {
      vi.advanceTimersByTime(699)
    })
    expect(document.body.textContent).not.toContain('First')
    await act(async () => {
      vi.advanceTimersByTime(1)
    })
    expect(document.body.textContent).toContain('First')
    const content = document.querySelector('[data-slot="tooltip-content"]') as HTMLElement
    expect(content.style.pointerEvents).toBe('auto')
    await leave(0)
    await act(async () => {
      vi.advanceTimersByTime(150)
    })
    await hover(1)
    await act(async () => {
      vi.advanceTimersByTime(1)
    })
    expect(document.body.textContent).toContain('Second')
  })
})
