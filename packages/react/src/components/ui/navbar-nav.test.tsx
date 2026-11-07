// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { NavbarNav } from './navbar'

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

describe('navbar nav', () => {
  it('names an omitted navigation Navigation and keeps a passed name', () => {
    show(
      <>
        <NavbarNav />
        <NavbarNav aria-label="Sections" />
      </>
    )
    const labels = [...document.querySelectorAll('[data-slot="navbar-nav"]')].map((node) =>
      node.getAttribute('aria-label')
    )
    expect(labels).toEqual(['Navigation', 'Sections'])
  })
})
