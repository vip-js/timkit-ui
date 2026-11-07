// @vitest-environment jsdom

import { act, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'

import { DataTable } from './data-table'

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
  return host
}

const rows = [
  { id: '2', cells: { name: 'Grace' } },
  { id: '1', cells: { name: 'Ada' } },
]

const cells = () => [...document.querySelectorAll('tbody td:last-child')].map((cell) => cell.textContent)

describe('data table', () => {
  it('sorts, selects rows, shows an empty state, and moves focus with the keyboard', () => {
    show(<DataTable caption="People" columns={[{ id: 'name', header: 'Name' }]} rows={rows} />)
    const name = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Name')
    act(() => name?.click())
    expect(document.querySelector('th[aria-sort="ascending"]')).toBeTruthy()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Sorted by Name, ascending')
    expect(cells()).toEqual(['Ada', 'Grace'])
    act(() => name?.click())
    expect(document.querySelector('th[aria-sort="descending"]')).toBeTruthy()
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Sorted by Name, descending')
    expect(cells()).toEqual(['Grace', 'Ada'])

    const first = document.querySelector('tbody tr') as HTMLElement
    first.focus()
    act(() => {
      first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    })
    const second = document.querySelectorAll('tbody tr')[1] as HTMLElement
    expect(document.activeElement).toBe(second)
    act(() => {
      second.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    })
    expect(second.getAttribute('aria-selected')).toBe('true')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain('1 row selected')

    const selectGrace = document.querySelector('[aria-label="Select 2"]') as HTMLInputElement
    act(() => selectGrace.click())
    expect(document.querySelectorAll('tr[aria-selected="true"]')).toHaveLength(2)
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain('2 rows selected')
  })

  it('jumps to the first and last row with Home and End without selecting them', () => {
    const people = [
      { id: '1', cells: { name: 'Ada' } },
      { id: '2', cells: { name: 'Grace' } },
      { id: '3', cells: { name: 'Lin' } },
    ]
    show(
      <>
        <DataTable caption="People" columns={[{ id: 'name', header: 'Name' }]} rows={people} />
        <DataTable caption="Locked" columns={[{ id: 'name', header: 'Name' }]} rows={people} disabled />
      </>
    )
    const table = (index: number) => document.querySelectorAll('table')[index]
    const row = (index: number, at: number) => table(index).querySelectorAll('tbody tr')[at] as HTMLElement
    row(0, 0).focus()
    act(() => {
      row(0, 0).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    })
    expect(document.activeElement).toBe(row(0, 2))
    expect(row(0, 2).getAttribute('aria-selected')).toBe('false')
    expect(row(0, 2).textContent).toContain('Lin')
    act(() => {
      row(0, 2).dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    })
    expect(document.activeElement).toBe(row(0, 0))
    expect(row(0, 0).getAttribute('aria-selected')).toBe('false')
    act(() => {
      row(1, 0).dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    })
    expect(row(1, 0).tabIndex).toBe(0)
    expect(row(1, 2).tabIndex).toBe(-1)
    expect(row(1, 2).getAttribute('aria-selected')).toBe('false')
  })

  it('follows a later sort and selection and ignores clicks while disabled', () => {
    function Harness() {
      const [sortColumn, setSortColumn] = useState('name')
      const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
      const [selectedIds, setSelectedIds] = useState<string[]>([])
      return (
        <>
          <button type="button" onClick={() => setSortDirection('desc')}>
            Descend
          </button>
          <button type="button" onClick={() => setSortColumn('')}>
            Clear
          </button>
          <button type="button" onClick={() => setSelectedIds(['2'])}>
            Pick
          </button>
          <DataTable
            caption="People"
            columns={[{ id: 'name', header: 'Name' }]}
            rows={rows}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            selectedIds={selectedIds}
            disabled
            onSortChange={() => setSortDirection('desc')}
            onSelectionChange={() => setSelectedIds(['1'])}
          />
        </>
      )
    }
    show(<Harness />)
    expect(cells()).toEqual(['Ada', 'Grace'])
    expect((document.querySelector('tr[data-row]') as HTMLElement).tabIndex).toBe(-1)
    expect(document.querySelector('tr[data-row]')?.getAttribute('aria-disabled')).toBe('true')
    const name = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Name')
    const selectAda = document.querySelector('[aria-label="Select 1"]') as HTMLInputElement
    act(() => {
      name?.click()
      selectAda.click()
    })
    expect(document.querySelector('th[aria-sort="ascending"]')).toBeTruthy()
    expect(document.querySelectorAll('tr[aria-selected="true"]')).toHaveLength(0)
    const press = (label: string) =>
      [...document.querySelectorAll('button')].find((button) => button.textContent === label)
    act(() => press('Descend')?.click())
    expect(cells()).toEqual(['Grace', 'Ada'])
    act(() => press('Pick')?.click())
    expect(document.querySelector('[aria-label="Select 2"]')).toHaveProperty('checked', true)
    act(() => press('Clear')?.click())
    expect(document.querySelector('th[aria-sort="none"]')).toBeTruthy()
    expect(cells()).toEqual(['Grace', 'Ada'])
  })

  it('stays empty when selection is null', () => {
    const seen: string[][] = []
    show(
      <DataTable
        caption="People"
        columns={[{ id: 'name', header: 'Name' }]}
        rows={rows}
        sortColumn={null}
        selectedIds={null}
        onSelectionChange={(ids) => seen.push(ids)}
      />
    )
    expect(document.querySelector('th[aria-sort="none"]')).toBeTruthy()
    expect(document.querySelectorAll('tr[aria-selected="true"]')).toHaveLength(0)
    const selectAda = document.querySelector('[aria-label="Select 1"]') as HTMLInputElement
    act(() => selectAda.click())
    expect(document.querySelectorAll('tr[aria-selected="true"]')).toHaveLength(0)
    expect(seen.at(-1)).toEqual(['1'])
  })

  it('shows the empty label when there are no rows', () => {
    show(
      <DataTable
        caption="People"
        columns={[{ id: 'name', header: 'Name' }]}
        rows={[]}
        emptyLabel="Nothing here"
      />
    )
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Nothing here')
  })

  it('filters rows by cell text and selects only the visible rows', () => {
    show(<DataTable caption="People" columns={[{ id: 'name', header: 'Name' }]} rows={rows} />)
    const filter = document.querySelector('[aria-label="Filter rows"]') as HTMLInputElement
    const type = (value: string) => {
      act(() => {
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(filter, value)
        filter.dispatchEvent(new Event('input', { bubbles: true }))
        filter.dispatchEvent(new Event('change', { bubbles: true }))
      })
    }
    type('ada')
    expect(cells()).toEqual(['Ada'])
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain('1 row matches')
    const selectAll = document.querySelector('[aria-label="Select all rows"]') as HTMLInputElement
    act(() => selectAll.click())
    expect(document.querySelector('[aria-label="Select 1"]')).toBeTruthy()
    expect(document.querySelector('[aria-label="Select 2"]')).toBeNull()
    type('zzz')
    expect(document.querySelector('[role="status"]')?.textContent).toBe('No results')
    type('')
    expect(cells()).toEqual(['Grace', 'Ada'])
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).not.toContain('1 row matches')
    type('a')
    expect([...document.querySelectorAll('[role="status"]')].map((node) => node.textContent)).toContain('2 rows match')
  })

  it('pages the visible rows and returns to the first page when the filter changes', () => {
    show(<DataTable caption="People" columns={[{ id: 'name', header: 'Name' }]} rows={rows} pageSize={1} />)
    const button = (label: string) =>
      [...document.querySelectorAll('button')].find((item) => item.textContent === label) as HTMLButtonElement
    expect(cells()).toEqual(['Grace'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Page 1 of 2')
    expect(button('Previous page').disabled).toBe(true)
    act(() => button('Next page').click())
    expect(cells()).toEqual(['Ada'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Page 2 of 2')
    expect(button('Next page').disabled).toBe(true)
    const selectAll = document.querySelector('[aria-label="Select all rows"]') as HTMLInputElement
    act(() => selectAll.click())
    expect(document.querySelector('[aria-label="Select 1"]')).toBeTruthy()
    expect(document.querySelector('[aria-label="Select 2"]')).toBeNull()
    const filter = document.querySelector('[aria-label="Filter rows"]') as HTMLInputElement
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set?.call(filter, 'grace')
      filter.dispatchEvent(new Event('input', { bubbles: true }))
      filter.dispatchEvent(new Event('change', { bubbles: true }))
    })
    expect(cells()).toEqual(['Grace'])
    expect(document.querySelector('[role="status"]')?.textContent).toBe('Page 1 of 1')
    expect(button('Previous page').disabled).toBe(true)
    expect(button('Next page').disabled).toBe(true)
  })

  it('expands a row detail and keeps arrow keys on the data rows', () => {
    const detailed = [
      { id: '2', cells: { name: 'Grace' }, detail: 'Grace notes' },
      { id: '1', cells: { name: 'Ada' } },
    ]
    show(<DataTable caption="People" columns={[{ id: 'name', header: 'Name' }]} rows={detailed} />)
    const button = (label: string) =>
      [...document.querySelectorAll('button')].find((item) => item.textContent === label) as HTMLButtonElement
    expect(document.getElementById('row-detail-2')).toBeNull()
    act(() => button('Expand 2').click())
    expect(document.getElementById('row-detail-2')?.textContent).toBe('Grace notes')
    expect(button('Collapse 2').getAttribute('aria-expanded')).toBe('true')
    const table = document.querySelector('table') as HTMLElement
    const first = document.querySelector('tbody tr[data-row]') as HTMLElement
    first.focus()
    act(() => table.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })))
    expect(document.activeElement?.textContent).toContain('Ada')
    const collapse = button('Collapse 2')
    collapse.focus()
    act(() => collapse.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true })))
    expect((document.querySelector('[aria-label="Select 2"]') as HTMLInputElement).checked).toBe(false)
    act(() => button('Collapse 2').click())
    expect(document.getElementById('row-detail-2')).toBeNull()
    const locked = show(
      <DataTable caption="People" columns={[{ id: 'name', header: 'Name' }]} rows={detailed} disabled />
    )
    const lockedButton = [...locked.querySelectorAll('button')].find((item) => item.textContent === 'Expand 2') as HTMLButtonElement
    expect(lockedButton.disabled).toBe(true)
    act(() => lockedButton.click())
    expect(locked.querySelector('#row-detail-2')).toBeNull()
  })
})
