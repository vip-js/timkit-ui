// @vitest-environment jsdom

import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Pagination, PaginationContent, PaginationItem, PaginationNext } from './pagination'

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

describe('pagination links', () => {
  it('follows an enabled next link and ignores a disabled one', async () => {
    let page = 1
    show(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext href="#2" onClick={() => (page = 2)} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext isDisabled href="#9" onClick={() => (page = 9)}>
              Blocked
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    const links = document.querySelectorAll('[data-slot="pagination-link"]')
    await act(async () => {
      ;(links[0] as HTMLAnchorElement).click()
    })
    expect(page).toBe(2)
    await act(async () => {
      ;(links[1] as HTMLAnchorElement).click()
    })
    expect(page).toBe(2)
    expect(links[1]?.getAttribute('aria-disabled')).toBe('true')
    expect(links[1]?.getAttribute('href')).toBeNull()
  })
})
