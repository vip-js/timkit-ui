import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Pagination from './pagination.vue'
import PaginationContent from './pagination-content.vue'
import PaginationEllipsis from './pagination-ellipsis.vue'
import PaginationLink from './pagination-link.vue'
import PaginationNext from './pagination-next.vue'
import PaginationPrevious from './pagination-previous.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

const selected = (page: number) =>
  document.querySelector(`[data-index="${page}"]`)?.getAttribute('data-selected')

describe('vue pagination', () => {
  it('follows a later page', async () => {
    const page = ref(1)
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => {
                    page.value = 3
                  },
                },
                'Jump'
              ),
              h(Pagination, { count: 30, pageSize: 10, page: page.value }, () => [
                h(PaginationLink, { page: 1 }, () => '1'),
                h(PaginationLink, { page: 3 }, () => '3'),
              ]),
            ])
        },
      })
    )
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(selected(1)).toBe('')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Page 1 of 3')
    const pageButton = (label: string) =>
      [...host.querySelectorAll('button')].find((node) => node.textContent === label)
    expect(pageButton('1')?.getAttribute('aria-current')).toBe('page')
    expect(pageButton('3')?.getAttribute('aria-current')).toBeNull()
    document.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(selected(3)).toBe('')
    expect(host.querySelector('[role="status"]')?.textContent).toBe('Page 3 of 3')
    expect(pageButton('3')?.getAttribute('aria-current')).toBe('page')
    expect(pageButton('1')?.getAttribute('aria-current')).toBeNull()
    expect(selected(1)).toBeNull()
  })

  it('moves to the next page and stays on the first page when going back', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Pagination, { count: 30, pageSize: 10 }, () => [
          h(PaginationPrevious),
          h(PaginationLink, { page: 1 }, () => '1'),
          h(PaginationLink, { page: 2 }, () => '2'),
          h(PaginationNext),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    expect(selected(1)).toBe('')
    ;(document.querySelector('[aria-label="next page"]') as HTMLElement).click()
    await nextTick()
    expect(selected(2)).toBe('')
    ;(document.querySelector('[aria-label="previous page"]') as HTMLElement).click()
    ;(document.querySelector('[aria-label="previous page"]') as HTMLElement).click()
    await nextTick()
    expect(selected(1)).toBe('')
  })

  it('stays off every page when page is null even if the default is 1', async () => {
    const seen: number[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Pagination,
          {
            count: 30,
            pageSize: 10,
            page: null,
            defaultPage: 1,
            onPageChange: (details: { page: number }) => seen.push(details.page),
          },
          () => [h(PaginationLink, { page: 1 }, () => '1'), h(PaginationNext)]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const current = () => document.querySelector('[aria-label="pagination"]')?.getAttribute('data-page')
    expect(current()).toBeNull()
    expect(selected(1)).toBeNull()
    ;(document.querySelector('[aria-label="next page"]') as HTMLElement).click()
    await nextTick()
    expect(current()).toBeNull()
    expect(selected(1)).toBeNull()
    expect(seen).toEqual([2])
  })

  it('ignores the next page while disabled', async () => {
    const seen: number[] = []
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(
          Pagination,
          {
            count: 30,
            pageSize: 10,
            disabled: true,
            onPageChange: (details: { page: number }) => seen.push(details.page),
          },
          () => [h(PaginationLink, { page: 1 }, () => '1'), h(PaginationNext)]
        ),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const next = document.querySelector('[aria-label="next page"]') as HTMLButtonElement
    expect(next.disabled).toBe(true)
    next.click()
    await nextTick()
    expect(selected(1)).toBe('')
    expect(seen).toEqual([])
  })

  it('names an omitted pagination pagination and keeps a passed name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () => h('div', [h(Pagination), h(Pagination, { 'aria-label': 'Pages' })]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const labels = [...host.querySelectorAll('nav')].map((node) => node.getAttribute('aria-label'))
    expect(labels).toEqual(['pagination', 'Pages'])
  })

  it('hides the page gap from the pagination name', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h(Pagination, { count: 100, pageSize: 10, page: 5 }, () => h(PaginationContent)),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const gaps = [...host.querySelectorAll('[data-slot="pagination-ellipsis"]')]
    expect(gaps.length).toBeGreaterThan(0)
    expect(gaps.every((node) => node.getAttribute('aria-hidden') === 'true')).toBe(true)
    const iconHost = document.createElement('div')
    document.body.append(iconHost)
    const iconApp = createApp({ render: () => h(PaginationEllipsis, { index: 0 }) })
    iconApp.mount(iconHost)
    mounted.push({ unmount: () => iconApp.unmount(), host: iconHost })
    await nextTick()
    expect(iconHost.querySelector('[data-slot="pagination-ellipsis"]')?.getAttribute('aria-hidden')).toBe('true')
    expect(iconHost.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  })
})
