// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { ScrollArea } from './scroll-area'

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

const viewport = () => document.querySelector('[data-slot="scroll-viewport"]') as HTMLElement

describe('scroll area orientation', () => {
  it('scrolls on the requested axis', () => {
    show(<ScrollArea>Vertical</ScrollArea>)
    expect(viewport().getAttribute('data-orientation')).toBe('vertical')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Vertical')
    expect(viewport().style.overflowY).toBe('auto')
    expect(viewport().style.overflowX).toBe('hidden')
    act(() => {
      mounted[0].root.render(<ScrollArea orientation="horizontal">Horizontal</ScrollArea>)
    })
    expect(viewport().getAttribute('data-orientation')).toBe('horizontal')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Horizontal')
    expect(viewport().style.overflowX).toBe('auto')
    expect(viewport().style.overflowY).toBe('hidden')
    act(() => {
      mounted[0].root.render(<ScrollArea orientation="both">Both</ScrollArea>)
    })
    expect(viewport().style.overflowX).toBe('auto')
    expect(viewport().style.overflowY).toBe('auto')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Both')
  })

  it('names an omitted scroller Scroll area and lets aria-labelledby suppress that name', () => {
    show(
      <>
        <ScrollArea>One</ScrollArea>
        <ScrollArea aria-label="Notes">Two</ScrollArea>
        <ScrollArea aria-label="Notes" aria-labelledby="notes-title">
          Three
        </ScrollArea>
      </>
    )
    const labels = [...document.querySelectorAll('[data-slot="scroll-viewport"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Scroll area', 'Notes', null])
    expect(document.querySelectorAll('[data-slot="scroll-viewport"]')[2]?.getAttribute('aria-labelledby')).toBe(
      'notes-title'
    )
  })
})
