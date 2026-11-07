// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Popover, PopoverContent, PopoverTrigger } from './popover'

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

const trigger = () => document.querySelector('[data-slot="popover-trigger"]') as HTMLButtonElement

describe('popover open', () => {
  it('opens on click, closes on the next click, and stays closed when disabled', async () => {
    const seen: boolean[] = []
    show(
      <>
        <Popover onOpenChange={(open) => seen.push(open)}>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Details</PopoverContent>
        </Popover>
        <Popover disabled>
          <PopoverTrigger>Locked</PopoverTrigger>
          <PopoverContent>Hidden</PopoverContent>
        </Popover>
      </>
    )
    const buttons = () => document.querySelectorAll('[data-slot="popover-trigger"]')
    expect(document.body.textContent).not.toContain('Details')
    await act(async () => {
      ;(buttons()[0] as HTMLButtonElement).click()
    })
    expect(document.body.textContent).toContain('Details')
    expect(trigger().getAttribute('data-state')).toBe('open')
    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Opened')
    await act(async () => {
      ;(buttons()[0] as HTMLButtonElement).click()
    })
    expect(document.body.textContent).not.toContain('Details')
    expect(document.querySelector('[role="status"]')).toBeNull()
    expect(document.activeElement).toBe(buttons()[0])
    await act(async () => {
      ;(buttons()[1] as HTMLButtonElement).click()
    })
    expect(document.body.textContent).not.toContain('Hidden')
    expect((buttons()[1] as HTMLButtonElement).disabled).toBe(true)
    expect(seen).toEqual([true, false])
  })

  it('sets aria-modal only when modal is true', async () => {
    show(
      <>
        <Popover modal>
          <PopoverTrigger>Modal</PopoverTrigger>
          <PopoverContent>Modal body</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>Plain</PopoverTrigger>
          <PopoverContent>Plain body</PopoverContent>
        </Popover>
      </>
    )
    const buttons = () => document.querySelectorAll('[data-slot="popover-trigger"]')
    await act(async () => {
      ;(buttons()[0] as HTMLButtonElement).click()
      ;(buttons()[1] as HTMLButtonElement).click()
    })
    const content = (text: string) =>
      [...document.querySelectorAll('[data-slot="popover-content"]')].find((node) => node.textContent?.includes(text))
    expect(content('Modal body')?.getAttribute('aria-modal')).toBe('true')
    expect(content('Plain body')?.getAttribute('aria-modal')).toBeNull()
  })

  it('names an omitted popover Popover and keeps a passed name', async () => {
    show(
      <>
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Body</PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>Named</PopoverTrigger>
          <PopoverContent aria-label="Details">Body</PopoverContent>
        </Popover>
      </>
    )
    const buttons = () => document.querySelectorAll('[data-slot="popover-trigger"]')
    await act(async () => {
      ;(buttons()[0] as HTMLButtonElement).click()
      ;(buttons()[1] as HTMLButtonElement).click()
    })
    const labels = [...document.querySelectorAll('[data-slot="popover-content"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Popover', 'Details'])
    const content = document.querySelector('[data-slot="popover-content"]')
    expect(buttons()[0]?.getAttribute('aria-controls')).toBe(content?.id)
    expect(content?.getAttribute('role')).toBe('dialog')
    expect(buttons()[0]?.getAttribute('aria-haspopup')).toBe('dialog')
  })
})
