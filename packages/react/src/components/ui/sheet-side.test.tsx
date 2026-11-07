// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Sheet, SheetContent, SheetDescription, SheetTitle } from './sheet'

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

const contentClass = () => document.querySelector('[data-slot="sheet-content"]')?.className ?? ''

describe('sheet side', () => {
  it('docks the content on the side set by the sheet root', () => {
    show(
      <Sheet side="left" defaultOpen>
        <SheetContent>
          <SheetTitle>Panel</SheetTitle>
          <SheetDescription>More about this sheet.</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    expect(contentClass()).toContain('left-0')
    expect(contentClass()).not.toContain('right-0')
    const content = document.querySelector('[data-slot="sheet-content"]')
    const title = document.querySelector('[data-slot="sheet-title"]')
    const description = document.querySelector('[data-slot="sheet-description"]')
    expect(content?.getAttribute('aria-labelledby')).toBe(title?.id)
    expect(content?.getAttribute('aria-describedby')).toBe(description?.id)
    expect(content?.getAttribute('aria-label')).toBeNull()
  })

  it('lets the content side override the root', () => {
    show(
      <Sheet side="left" defaultOpen>
        <SheetContent side="top">
          <SheetTitle>Panel</SheetTitle>
        </SheetContent>
      </Sheet>
    )
    expect(contentClass()).toContain('top-0')
    expect(contentClass()).not.toContain('left-0')
  })

  it('names an omitted sheet Sheet and keeps a passed name', () => {
    show(
      <>
        <Sheet defaultOpen>
          <SheetContent />
        </Sheet>
        <Sheet defaultOpen>
          <SheetContent aria-label="Notice" />
        </Sheet>
      </>
    )
    const labels = [...document.querySelectorAll('[data-slot="sheet-content"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Sheet', 'Notice'])
  })
})
