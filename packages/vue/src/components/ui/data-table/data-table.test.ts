import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import DataTable from './data-table.vue'

const mounted: Array<() => void> = []

afterEach(() => {
  for (const unmount of mounted) unmount()
  mounted.length = 0
  document.body.innerHTML = ''
})

const show = (props: Record<string, unknown>) => {
  const el = document.createElement('div')
  document.body.append(el)
  const app = createApp({ render: () => h(DataTable, props as never) })
  app.mount(el)
  mounted.push(() => app.unmount())
}

const rows = [
  { id: '2', cells: { name: 'Grace' } },
  { id: '1', cells: { name: 'Ada' } },
]

const cells = () => [...document.querySelectorAll('tbody td:last-child')].map((cell) => cell.textContent)

describe('vue data table', () => {
  it('sorts, selects rows, and moves focus with the keyboard', async () => {
    show({ caption: 'People', columns: [{ id: 'name', header: 'Name' }], rows })
    await nextTick()
    const name = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Name')
    name?.click()
    await nextTick()
    expect(document.querySelector('th[aria-sort="ascending"]')).toBeTruthy()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Sorted by Name, ascending')
    expect(cells()).toEqual(['Ada', 'Grace'])
    name?.click()
    await nextTick()
    expect(document.querySelector('th[aria-sort="descending"]')).toBeTruthy()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Sorted by Name, descending')
    expect(cells()).toEqual(['Grace', 'Ada'])

    const first = document.querySelector('tbody tr') as HTMLElement
    first.focus()
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    const second = document.querySelectorAll('tbody tr')[1] as HTMLElement
    expect(document.activeElement).toBe(second)
    second.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()
    expect(second.getAttribute('aria-selected')).toBe('true')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain('1 row selected')

    const selectGrace = document.querySelector('[aria-label="Select 2"]') as HTMLInputElement
    selectGrace.click()
    await nextTick()
    expect(document.querySelectorAll('tr[aria-selected="true"]')).toHaveLength(2)
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain('2 rows selected')
  })

  it('jumps to the first and last row with Home and End without selecting them', async () => {
    const people = [
      { id: '1', cells: { name: 'Ada' } },
      { id: '2', cells: { name: 'Grace' } },
      { id: '3', cells: { name: 'Lin' } },
    ]
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp({
      render: () =>
        h('div', [
          h(DataTable, { caption: 'People', columns: [{ id: 'name', header: 'Name' }], rows: people }),
          h(DataTable, { caption: 'Locked', columns: [{ id: 'name', header: 'Name' }], rows: people, disabled: true }),
        ]),
    })
    app.mount(el)
    mounted.push(() => app.unmount())
    await nextTick()
    const table = (index: number) => document.querySelectorAll('table')[index]
    const row = (index: number, at: number) => table(index).querySelectorAll('tbody tr')[at] as HTMLElement
    row(0, 0).focus()
    row(0, 0).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(row(0, 2))
    expect(row(0, 2).getAttribute('aria-selected')).toBe('false')
    expect(row(0, 2).textContent).toContain('Lin')
    row(0, 2).dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    await nextTick()
    expect(document.activeElement).toBe(row(0, 0))
    expect(row(0, 0).getAttribute('aria-selected')).toBe('false')
    row(1, 0).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    await nextTick()
    expect(row(1, 0).tabIndex).toBe(-1)
    expect(row(1, 2).tabIndex).toBe(-1)
    expect(row(1, 2).getAttribute('aria-selected')).toBe('false')
  })

  it('follows a later sort and selection and ignores clicks while disabled', async () => {
    const sortColumn = ref('name')
    const sortDirection = ref<'asc' | 'desc'>('asc')
    const selectedIds = ref<string[]>([])
    const el = document.createElement('div')
    document.body.append(el)
    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h('button', { type: 'button', onClick: () => (sortDirection.value = 'desc') }, 'Descend'),
              h('button', { type: 'button', onClick: () => (sortColumn.value = '') }, 'Clear'),
              h('button', { type: 'button', onClick: () => (selectedIds.value = ['2']) }, 'Pick'),
              h(DataTable, {
                caption: 'People',
                columns: [{ id: 'name', header: 'Name' }],
                rows,
                sortColumn: sortColumn.value,
                sortDirection: sortDirection.value,
                selectedIds: selectedIds.value,
                disabled: true,
              }),
            ])
        },
      })
    )
    app.mount(el)
    mounted.push(() => app.unmount())
    await nextTick()
    expect(cells()).toEqual(['Ada', 'Grace'])
    expect((document.querySelector('tr[data-row]') as HTMLElement).tabIndex).toBe(-1)
    expect(document.querySelector('tr[data-row]')?.getAttribute('aria-disabled')).toBe('true')
    const name = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Name')
    const selectAda = document.querySelector('[aria-label="Select 1"]') as HTMLInputElement
    name?.click()
    selectAda.click()
    await nextTick()
    expect(document.querySelector('th[aria-sort="ascending"]')).toBeTruthy()
    expect(document.querySelectorAll('tr[aria-selected="true"]')).toHaveLength(0)
    const press = (label: string) =>
      [...el.querySelectorAll('button')].find((button) => button.textContent === label)
    press('Descend')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(cells()).toEqual(['Grace', 'Ada'])
    press('Pick')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect((document.querySelector('[aria-label="Select 2"]') as HTMLInputElement).checked).toBe(true)
    press('Clear')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.querySelector('th[aria-sort="none"]')).toBeTruthy()
    expect(cells()).toEqual(['Grace', 'Ada'])
  })

  it('stays empty when selection is null', async () => {
    const seen: string[][] = []
    show({
      caption: 'People',
      columns: [{ id: 'name', header: 'Name' }],
      rows,
      sortColumn: null,
      selectedIds: null,
      onSelectionChange: (ids: string[]) => seen.push(ids),
    })
    await nextTick()
    expect(document.querySelector('th[aria-sort="none"]')).toBeTruthy()
    expect(document.querySelectorAll('tr[aria-selected="true"]')).toHaveLength(0)
    const selectAda = document.querySelector('[aria-label="Select 1"]') as HTMLInputElement
    selectAda.click()
    await nextTick()
    expect(document.querySelectorAll('tr[aria-selected="true"]')).toHaveLength(0)
    expect(seen.at(-1)).toEqual(['1'])
  })

  it('shows the empty label when there are no rows', async () => {
    show({
      caption: 'People',
      columns: [{ id: 'name', header: 'Name' }],
      rows: [],
      emptyLabel: 'Nothing here',
    })
    await nextTick()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Nothing here')
  })

  it('filters rows by cell text and selects only the visible rows', async () => {
    show({ caption: 'People', columns: [{ id: 'name', header: 'Name' }], rows })
    await nextTick()
    const filter = document.querySelector('[aria-label="Filter rows"]') as HTMLInputElement
    const type = async (value: string) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(filter, value)
      filter.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
    }
    await type('ada')
    expect(cells()).toEqual(['Ada'])
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain('1 row matches')
    const selectAll = document.querySelector('[aria-label="Select all rows"]') as HTMLInputElement
    selectAll.click()
    await nextTick()
    expect(document.querySelector('[aria-label="Select 1"]')).toBeTruthy()
    expect(document.querySelector('[aria-label="Select 2"]')).toBeNull()
    await type('zzz')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('No results')
    await type('')
    expect(cells()).toEqual(['Grace', 'Ada'])
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).not.toContain('1 row matches')
    await type('a')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain('2 rows match')
  })

  it('pages the visible rows and returns to the first page when the filter changes', async () => {
    show({ caption: 'People', columns: [{ id: 'name', header: 'Name' }], rows, pageSize: 1 })
    await nextTick()
    const button = (label: string) =>
      [...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === label) as HTMLButtonElement
    expect(cells()).toEqual(['Grace'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Page 1 of 2')
    expect(button('Previous page').disabled).toBe(true)
    button('Next page').click()
    await nextTick()
    expect(cells()).toEqual(['Ada'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Page 2 of 2')
    expect(button('Next page').disabled).toBe(true)
    const selectAll = document.querySelector('[aria-label="Select all rows"]') as HTMLInputElement
    selectAll.click()
    await nextTick()
    expect(document.querySelector('[aria-label="Select 1"]')).toBeTruthy()
    expect(document.querySelector('[aria-label="Select 2"]')).toBeNull()
    const filter = document.querySelector('[aria-label="Filter rows"]') as HTMLInputElement
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(filter, 'grace')
    filter.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(cells()).toEqual(['Grace'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Page 1 of 1')
    expect(button('Previous page').disabled).toBe(true)
    expect(button('Next page').disabled).toBe(true)
  })

  it('expands a row detail and keeps arrow keys on the data rows', async () => {
    const detailed = [
      { id: '2', cells: { name: 'Grace' }, detail: 'Grace notes' },
      { id: '1', cells: { name: 'Ada' } },
    ]
    show({ caption: 'People', columns: [{ id: 'name', header: 'Name' }], rows: detailed })
    await nextTick()
    const button = (label: string) =>
      [...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === label) as HTMLButtonElement
    expect(document.getElementById('row-detail-2')).toBeNull()
    button('Expand 2').click()
    await nextTick()
    expect(document.getElementById('row-detail-2')?.textContent).toBe('Grace notes')
    expect(button('Collapse 2').getAttribute('aria-expanded')).toBe('true')
    const table = document.querySelector('table') as HTMLElement
    const first = document.querySelector('tbody tr[data-row]') as HTMLElement
    first.focus()
    table.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await nextTick()
    expect(document.activeElement?.textContent).toContain('Ada')
    const collapse = button('Collapse 2')
    collapse.focus()
    collapse.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()
    expect((document.querySelector('[aria-label="Select 2"]') as HTMLInputElement).checked).toBe(false)
    button('Collapse 2').click()
    await nextTick()
    expect(document.getElementById('row-detail-2')).toBeNull()
    show({ caption: 'People', columns: [{ id: 'name', header: 'Name' }], rows: detailed, disabled: true })
    await nextTick()
    const locked = [...document.querySelectorAll('table')].at(-1) as HTMLElement
    const lockedButton = [...locked.querySelectorAll('button')].find(
      (item) => item.textContent?.trim() === 'Expand 2'
    ) as HTMLButtonElement
    expect(lockedButton.disabled).toBe(true)
    lockedButton.click()
    await nextTick()
    expect(locked.querySelector('#row-detail-2')).toBeNull()
  })
})
