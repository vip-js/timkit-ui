import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, expect, it } from 'vitest'
import type { SortState, TableRowData } from '@timui/core'

type ComponentDefinition = {
  data?: {
    sort?: SortState
    selectedIds?: string[]
    activeIndex?: number
    ordered?: TableRowData[]
    empty?: boolean
  }
  methods?: Record<string, (event?: Record<string, unknown>) => void>
  properties?: Record<string, { value?: unknown }>
  observers?: Record<string, (value?: unknown) => void>
  lifetimes?: { attached?: () => void }
}

const rows = [
  { id: '2', cells: { name: 'Grace' } },
  { id: '1', cells: { name: 'Ada' } },
]

let definitionCache: ComponentDefinition | null = null

const loadDefinition = async () => {
  if (definitionCache) return definitionCache
  let captured: ComponentDefinition | null = null
  ;(globalThis as { Component?: (definition: ComponentDefinition) => void }).Component = (definition) => {
    captured = definition
  }
  await import(pathToFileURL(path.join(__dirname, 'data-table.ts')).href)
  if (!captured) throw new Error('data table component was not registered')
  definitionCache = captured
  return definitionCache
}

const hostFor = async (properties: Record<string, unknown> = {}) => {
  const definition = await loadDefinition()
  const data = { ...(definition.data ?? {}) }
  const defaults: Record<string, unknown> = {}
  for (const [key, spec] of Object.entries(definition.properties ?? {})) defaults[key] = spec?.value
  const events: Array<{ name: string; detail: unknown }> = []
  const host = {
    properties: { ...defaults, columns: [{ id: 'name', header: 'Name' }], rows, ...properties },
    data,
    events,
    setData(update: Record<string, unknown>) {
      Object.assign(data, update)
    },
    triggerEvent(name: string, detail: unknown) {
      events.push({ name, detail })
    },
    setProperty(key: string, value: unknown) {
      host.properties[key] = value
      definition.observers?.[key]?.call(host, value)
    },
  }
  Object.assign(host, definition.methods ?? {})
  definition.lifetimes?.attached?.call(host)
  return host as typeof host & Record<string, (event?: Record<string, unknown>) => void>
}

describe('weapp data table', () => {
  it('renders sort, selection, and the empty state', () => {
    const markup = fs.readFileSync(path.join(__dirname, 'data-table.wxml'), 'utf8')
    expect(markup).toContain('role="table"')
    expect(markup).toContain('aria-label="{{caption}}"')
    expect(markup).toContain('class="sr-only">{{caption}}</text>')
    expect(markup).toContain('role="columnheader"')
    expect(markup).toContain("tabindex=\"{{disabled ? -1 : 0}}\"")
    expect(markup).toContain("tabindex=\"{{!disabled && index === activeIndex ? 0 : -1}}\"")
    expect(markup).toContain('aria-sort="{{item.sort}}"')
    expect(markup).toContain('{{sortStatus}}')
    expect(markup).toContain('{{selectionStatus}}')
    expect(markup).toContain('{{matchStatus}}')
    expect(markup).toContain('aria-label="Filter rows"')
    expect(markup).toContain('Page {{page + 1}} of {{pageCount}}')
    expect(markup).toContain('aria-label="Previous page"')
    expect(markup).toContain('aria-label="Next page"')
    expect(markup).toContain('wx:if="{{item.detail && item.expanded}}"')
    expect(markup).toContain('aria-controls="row-detail-{{item.id}}"')
    expect(markup).toContain('wx:elif="{{item.detail}}"')
    expect(markup.split('wx:elif="{{item.detail}}"')[1].split('role="checkbox"')[0]).not.toContain('aria-controls')
    expect(markup).toContain('aria-expanded="{{item.expanded ? \'true\' : \'false\'}}"')
    expect(markup).toContain('role="columnheader"')
    expect(markup).toContain('wx:if="{{expandable}}" role="cell"')
    expect(markup).toContain('aria-label="Select all rows"')
    expect(markup).toContain('aria-label="Select {{item.id}}"')
    expect(markup).toContain('role="status"')
    expect(markup).toContain('wx:if="{{empty}}" role="row"')
    expect(markup).toContain('id="row-detail-{{item.id}}" role="cell"')
    expect(markup).toContain('{{emptyLabel}}')
    expect(markup).toContain('bindkeydown="onKey"')
    expect(markup).toContain('bindkeydown="onSortKey"')
    expect(markup).toContain('bindkeydown="onToggleAllKey"')
    expect(markup).toContain('bindkeydown="onToggleRowKey"')
  })

  it('sorts, selects a row, and moves the cursor with the keyboard', async () => {
    const host = await hostFor()
    host.onSortKey({ detail: { key: 'Enter' }, mark: { columnId: 'name' } })
    expect(host.data.sort).toEqual({ columnId: 'name', direction: 'asc' })
    expect(host.data.ordered?.map((row) => row.cells.name)).toEqual(['Ada', 'Grace'])
    expect(host.data.headers).toEqual([{ id: 'name', header: 'Name', sort: 'ascending' }])
    expect(host.data.sortStatus).toBe('Sorted by Name, ascending')
    expect(host.data.viewRows?.map((row) => row.cells.map((cell) => cell.text))).toEqual([['Ada'], ['Grace']])
    host.onSort({ mark: { columnId: 'name' } })
    expect(host.data.sort).toEqual({ columnId: 'name', direction: 'desc' })
    expect(host.data.sortStatus).toBe('Sorted by Name, descending')
    expect(host.data.ordered?.map((row) => row.cells.name)).toEqual(['Grace', 'Ada'])

    host.onKey({ detail: { key: 'ArrowDown' } })
    expect(host.data.activeIndex).toBe(1)
    host.onKey({ detail: { key: ' ' } })
    expect(host.data.selectedIds).toEqual(['1'])
    expect(host.data.selectionStatus).toBe('1 row selected')
    host.onToggleAllKey({ detail: { key: ' ' } })
    expect(host.data.selectedIds).toEqual(['2', '1'])
    expect(host.data.selectionStatus).toBe('2 rows selected')
    host.onToggleRowKey({ detail: { key: ' ' }, mark: { id: '1' } })
    expect(host.data.selectedIds).toEqual(['2'])
    expect(host.data.selectionStatus).toBe('1 row selected')
  })

  it('jumps to the first and last row with Home and End without selecting them', async () => {
    const people = [
      { id: '1', cells: { name: 'Ada' } },
      { id: '2', cells: { name: 'Grace' } },
      { id: '3', cells: { name: 'Lin' } },
    ]
    const host = await hostFor({ rows: people })
    host.onKey({ detail: { key: 'End' } })
    expect(host.data.activeIndex).toBe(2)
    expect(host.data.ordered?.[2]?.cells.name).toBe('Lin')
    expect(host.data.selectedIds).toEqual([])
    host.onKey({ detail: { key: 'Home' } })
    expect(host.data.activeIndex).toBe(0)
    expect(host.data.selectedIds).toEqual([])

    const disabled = await hostFor({ rows: people, disabled: true })
    disabled.onKey({ detail: { key: 'End' } })
    expect(disabled.data.activeIndex).toBe(0)
    expect(disabled.data.selectedIds).toEqual([])
  })

  it('follows a later sort and selection and ignores clicks while disabled', async () => {
    const host = await hostFor({
      disabled: true,
      sortColumn: 'name',
      sortDirection: 'asc',
    })
    expect(host.data.ordered?.map((row) => row.cells.name)).toEqual(['Ada', 'Grace'])
    host.onSort({ mark: { columnId: 'name' } })
    host.onToggleRow({ mark: { id: '1' } })
    expect(host.data.sort).toEqual({ columnId: 'name', direction: 'asc' })
    expect(host.data.selectedIds).toEqual([])
    host.setProperty('sortDirection', 'desc')
    expect(host.data.ordered?.map((row) => row.cells.name)).toEqual(['Grace', 'Ada'])
    host.setProperty('selectedIds', ['2'])
    expect(host.data.selectedIds).toEqual(['2'])
    host.setProperty('sortColumn', '')
    expect(host.data.sort).toBeNull()
    host.setProperty('selectedIds', [])
    expect(host.data.selectedIds).toEqual([])
  })

  it('asks the parent to change a controlled sort and selection', async () => {
    const host = await hostFor({ sortColumn: 'name', sortDirection: 'asc', selectedIds: ['2'] })
    expect(host.data.ordered?.map((row) => row.cells.name)).toEqual(['Ada', 'Grace'])
    host.onSort({ mark: { columnId: 'name' } })
    expect(host.data.sort).toEqual({ columnId: 'name', direction: 'asc' })
    expect(host.events.at(-1)).toEqual({
      name: 'sortChange',
      detail: { sortColumn: 'name', sortDirection: 'desc' },
    })
    host.setProperty('sortDirection', 'desc')
    expect(host.data.ordered?.map((row) => row.cells.name)).toEqual(['Grace', 'Ada'])

    host.onToggleRow({ mark: { id: '2' } })
    expect(host.data.selectedIds).toEqual(['2'])
    expect(host.events.at(-1)).toEqual({ name: 'selectionChange', detail: { selectedIds: [] } })
    host.setProperty('selectedIds', [])
    expect(host.data.selectedIds).toEqual([])
    host.onToggleRow({ mark: { id: '1' } })
    expect(host.data.selectedIds).toEqual([])
    expect(host.events.at(-1)).toEqual({ name: 'selectionChange', detail: { selectedIds: ['1'] } })
    host.setProperty('sortColumn', '')
    expect(host.data.sort).toBeNull()
    host.onSort({ mark: { columnId: 'name' } })
    expect(host.data.sort).toBeNull()
    expect(host.events.at(-1)).toEqual({
      name: 'sortChange',
      detail: { sortColumn: 'name', sortDirection: 'asc' },
    })
  })

  it('shows the empty state and ignores actions while disabled', async () => {
    const empty = await hostFor({ rows: [] })
    expect(empty.data.empty).toBe(true)
    expect(empty.properties.emptyLabel).toBe('No results')

    const host = await hostFor()
    host.onSort({ mark: { columnId: 'name' } })
    host.setProperty('rows', [
      { id: '4', cells: { name: 'Zoe' } },
      { id: '3', cells: { name: 'Bea' } },
    ])
    expect(host.data.empty).toBe(false)
    expect(host.data.ordered?.map((row) => row.cells.name)).toEqual(['Bea', 'Zoe'])
    host.setProperty('rows', [])
    expect(host.data.empty).toBe(true)
    expect(host.data.ordered).toEqual([])

    const disabled = await hostFor({ disabled: true })
    disabled.onSortKey({ detail: { key: ' ' }, mark: { columnId: 'name' } })
    disabled.onKey({ detail: { key: ' ' } })
    expect(disabled.data.sort).toBeNull()
    expect(disabled.data.selectedIds).toEqual([])
    disabled.onFilter({ detail: { value: 'ada' } })
    expect(disabled.data.query).toBe('')
  })

  it('filters rows by cell text and selects only the visible rows', async () => {
    const host = await hostFor()
    host.onFilter({ detail: { value: ' ada ' } })
    expect(host.data.ordered?.map((row) => row.id)).toEqual(['1'])
    expect(host.data.matchStatus).toBe('1 row matches')
    host.onToggleAll()
    expect(host.data.selectedIds).toEqual(['1'])
    host.onFilter({ detail: { value: 'zzz' } })
    expect(host.data.empty).toBe(true)
    expect(host.data.ordered).toEqual([])
    host.onFilter({ detail: { value: '' } })
    expect(host.data.ordered?.map((row) => row.id)).toEqual(['2', '1'])
    expect(host.data.matchStatus).toBe('')
    host.onFilter({ detail: { value: 'a' } })
    expect(host.data.matchStatus).toBe('2 rows match')
  })

  it('pages the visible rows and returns to the first page when the filter changes', async () => {
    const host = await hostFor({ pageSize: 1 })
    expect(host.data.ordered?.map((row) => row.id)).toEqual(['2'])
    expect(host.data.pageCount).toBe(2)
    host.onNextPage()
    expect(host.data.page).toBe(1)
    expect(host.data.ordered?.map((row) => row.id)).toEqual(['1'])
    host.onNextPage()
    expect(host.data.page).toBe(1)
    host.onToggleAll()
    expect(host.data.selectedIds).toEqual(['1'])
    host.onFilter({ detail: { value: 'grace' } })
    expect(host.data.page).toBe(0)
    expect(host.data.ordered?.map((row) => row.id)).toEqual(['2'])
    const disabled = await hostFor({ pageSize: 1, disabled: true })
    disabled.onNextPageKey({ detail: { key: 'Enter' } })
    expect(disabled.data.page).toBe(0)
    expect(disabled.data.ordered?.map((row) => row.id)).toEqual(['2'])
  })

  it('expands a row detail and ignores the button while disabled', async () => {
    const detailed = [
      { id: '2', cells: { name: 'Grace' }, detail: 'Grace notes' },
      { id: '1', cells: { name: 'Ada' } },
    ]
    const host = await hostFor({ rows: detailed })
    expect(host.data.viewRows?.[0]?.detail).toBe('Grace notes')
    expect(host.data.viewRows?.[0]?.expanded).toBe(false)
    host.onExpand({ currentTarget: { dataset: { id: '2' } } })
    expect(host.data.expandedIds).toEqual(['2'])
    expect(host.data.viewRows?.[0]?.expanded).toBe(true)
    host.onExpandKey({ detail: { key: 'Enter' }, currentTarget: { dataset: { id: '2' } } })
    expect(host.data.expandedIds).toEqual([])
    expect(host.data.viewRows?.[0]?.expanded).toBe(false)
    const locked = await hostFor({ rows: detailed, disabled: true })
    locked.onExpand({ currentTarget: { dataset: { id: '2' } } })
    expect(locked.data.expandedIds).toEqual([])
    expect(locked.data.viewRows?.[0]?.expanded).toBe(false)
  })
})