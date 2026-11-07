// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from './pagination'

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

describe('pagination page', () => {
  it('follows a later page', async () => {
    function Harness() {
      const [page, setPage] = useState(1)
      return (
        <>
          <button type="button" onClick={() => setPage(3)}>
            Jump
          </button>
          <Pagination count={30} pageSize={10} page={page} />
        </>
      )
    }
    show(<Harness />)
    const current = () => document.querySelector('[data-slot="pagination"]')?.getAttribute('data-page')
    expect(current()).toBe('1')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Page 1 of 3')
    const jump = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Jump')
    await act(async () => {
      jump?.click()
    })
    expect(current()).toBe('3')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Page 3 of 3')
  })

  it('moves between pages and stops at both ends', async () => {
    const seen: number[] = []
    show(
      <Pagination count={30} pageSize={10} onPageChange={(details) => seen.push(details.page)}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    const page = () => document.querySelector('[data-slot="pagination"]')?.getAttribute('data-page')
    const previous = () => document.querySelector('[aria-label="previous page"]') as HTMLButtonElement
    const next = () => document.querySelector('[aria-label="next page"]') as HTMLButtonElement
    expect(page()).toBe('1')
    await act(async () => {
      previous().click()
    })
    expect(page()).toBe('1')
    await act(async () => {
      next().click()
    })
    expect(page()).toBe('2')
    await act(async () => {
      next().click()
    })
    expect(page()).toBe('3')
    await act(async () => {
      next().click()
    })
    expect(page()).toBe('3')
    expect(next().disabled).toBe(true)
    expect(seen).toEqual([2, 3])
  })

  it('stays off every page when page is null even if the default is 1', async () => {
    const seen: number[] = []
    show(
      <Pagination
        count={30}
        pageSize={10}
        page={null}
        defaultPage={1}
        onPageChange={(details) => seen.push(details.page)}
      >
        <PaginationContent>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    const page = () => document.querySelector('[data-slot="pagination"]')?.getAttribute('data-page')
    const next = () => document.querySelector('[aria-label="next page"]') as HTMLButtonElement
    expect(page()).toBeNull()
    await act(async () => {
      next().click()
    })
    expect(page()).toBeNull()
    expect(seen).toEqual([2])
  })

  it('ignores the next page while disabled', async () => {
    const seen: number[] = []
    show(
      <Pagination count={30} pageSize={10} disabled onPageChange={(details) => seen.push(details.page)}>
        <PaginationContent>
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    const page = () => document.querySelector('[data-slot="pagination"]')?.getAttribute('data-page')
    const next = document.querySelector('[aria-label="next page"]') as HTMLButtonElement
    expect(page()).toBe('1')
    expect(next.disabled).toBe(true)
    await act(async () => {
      next.click()
    })
    expect(page()).toBe('1')
    expect(seen).toEqual([])
  })

  it('keeps fewer page numbers when siblingCount is 0', () => {
    show(
      <>
        <Pagination count={100} pageSize={10} page={5} siblingCount={1}>
          <PaginationContent />
        </Pagination>
        <Pagination count={100} pageSize={10} page={5} siblingCount={0}>
          <PaginationContent />
        </Pagination>
      </>
    )
    const numbers = (index: number) =>
      [...document.querySelectorAll('[data-slot="pagination-content"]')[index].querySelectorAll('button')].map(
        (button) => button.textContent
      )
    expect(numbers(0)).toEqual(['1', '4', '5', '6', '10'])
    expect(numbers(1)).toEqual(['1', '5', '10'])
  })

  it('rebuilds the page list when page size or the item count changes', async () => {
    function Harness() {
      const [pageSize, setPageSize] = useState(10)
      const [count, setCount] = useState(100)
      return (
        <>
          <button type="button" onClick={() => setPageSize(50)}>
            Widen
          </button>
          <button type="button" onClick={() => setCount(50)}>
            Shrink
          </button>
          <Pagination count={count} pageSize={pageSize} page={1}>
            <PaginationContent />
          </Pagination>
        </>
      )
    }
    show(<Harness />)
    const numbers = () =>
      [...document.querySelectorAll('[data-slot="pagination-link"]')].map((button) => button.textContent)
    const click = async (label: string) => {
      const button = [...document.querySelectorAll('button')].find((item) => item.textContent === label)
      await act(async () => {
        button?.click()
      })
    }
    expect(numbers()).toContain('10')
    await click('Widen')
    expect(numbers()).toEqual(['1', '2'])
    await click('Shrink')
    expect(numbers()).toEqual(['1'])
  })

  it('names an omitted pagination pagination and keeps a passed name', () => {
    show(
      <>
        <Pagination />
        <Pagination aria-label="Pages" />
      </>
    )
    const labels = [...document.querySelectorAll('nav')].map((node) => node.getAttribute('aria-label'))
    expect(labels).toEqual(['pagination', 'Pages'])
  })

  it('hides the page gap from the pagination name', () => {
    show(
      <Pagination count={100} pageSize={10} page={5}>
        <PaginationContent />
      </Pagination>
    )
    const gaps = [...document.querySelectorAll('[data-slot="pagination-ellipsis"]')]
    expect(gaps.length).toBeGreaterThan(0)
    expect(gaps.every((node) => node.getAttribute('aria-hidden') === 'true')).toBe(true)
    show(<PaginationEllipsis />)
    expect(document.querySelector('[data-slot="pagination-ellipsis"] svg')?.getAttribute('aria-hidden')).toBe('true')
  })
})
