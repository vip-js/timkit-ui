import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Pagination from './pagination.vue'
import PaginationContent from './pagination-content.vue'

const mounted: Array<{ unmount: () => void; host: HTMLElement }> = []

afterEach(() => {
  for (const item of mounted) {
    item.unmount()
    item.host.remove()
  }
  mounted.length = 0
  document.body.innerHTML = ''
})

describe('vue pagination siblingCount', () => {
  it('keeps fewer page numbers when siblingCount is 0', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const app = createApp({
      render: () =>
        h('div', [
          h(Pagination, { count: 100, pageSize: 10, page: 5, siblingCount: 1 }, () => h(PaginationContent)),
          h(Pagination, { count: 100, pageSize: 10, page: 5, siblingCount: 0 }, () => h(PaginationContent)),
        ]),
    })
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const numbers = (index: number) =>
      [...host.querySelectorAll('nav')[index].querySelectorAll('button')].map((button) => button.textContent)
    expect(numbers(0)).toEqual(['1', '4', '5', '6', '10'])
    expect(numbers(1)).toEqual(['1', '5', '10'])
  })

  it('rebuilds the page list when page size or the item count changes', async () => {
    const pageSize = ref(10)
    const count = ref(100)
    const host = document.createElement('div')
    document.body.append(host)
    const Harness = defineComponent({
      setup() {
        return () =>
          h('div', [
            h('button', { type: 'button', onClick: () => (pageSize.value = 50) }, 'Widen'),
            h('button', { type: 'button', onClick: () => (count.value = 50) }, 'Shrink'),
            h(Pagination, { count: count.value, pageSize: pageSize.value, page: 1 }, () => h(PaginationContent)),
          ])
      },
    })
    const app = createApp(Harness)
    app.mount(host)
    mounted.push({ unmount: () => app.unmount(), host })
    await nextTick()
    const numbers = () => [...host.querySelectorAll('nav button')].map((button) => button.textContent)
    expect(numbers()).toContain('10')
    ;(host.querySelector('button') as HTMLButtonElement).click()
    await nextTick()
    expect(numbers()).toEqual(['1', '2'])
    ;([...host.querySelectorAll('button')].find((button) => button.textContent === 'Shrink') as HTMLButtonElement).click()
    await nextTick()
    expect(numbers()).toEqual(['1'])
  })
})
