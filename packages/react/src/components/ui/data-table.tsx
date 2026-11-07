'use client'

import * as React from 'react'
import {
  allRowsSelected,
  cn,
  cycleSort,
  filterRows,
  isTableEmpty,
  pageCount,
  pageRows,
  reduceTableKey,
  sortRows,
  toggleAllSelection,
  toggleExpanded,
  toggleRowSelection,
  type SortState,
  type TableColumn,
  type TableRowData,
} from '@timui/core'

type DataTableProps = {
  columns: TableColumn[]
  rows: TableRowData[]
  caption: string
  emptyLabel?: string
  className?: string
  sortColumn?: string | null
  sortDirection?: 'asc' | 'desc'
  selectedIds?: string[] | null
  disabled?: boolean
  onSortChange?: (sort: SortState) => void
  onSelectionChange?: (selectedIds: string[]) => void
  onQueryChange?: (query: string) => void
  pageSize?: number
  expandedIds?: string[]
  onExpandedChange?: (expandedIds: string[]) => void
}

function DataTable({
  columns,
  rows,
  caption,
  emptyLabel = 'No results',
  className,
  sortColumn,
  sortDirection,
  selectedIds: selectedProp,
  disabled = false,
  onSortChange,
  onSelectionChange,
  onQueryChange,
  pageSize,
  expandedIds: expandedProp,
  onExpandedChange,
}: DataTableProps) {
  const [sortState, setSort] = React.useState<SortState>(null)
  const [selectedState, setSelectedIds] = React.useState<string[]>([])
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [query, setQuery] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [expandedState, setExpanded] = React.useState<string[]>([])
  const sortControlled = sortColumn !== undefined
  const selectionControlled = selectedProp !== undefined
  const sort: SortState = sortControlled
    ? sortColumn
      ? { columnId: sortColumn, direction: sortDirection === 'desc' ? 'desc' : 'asc' }
      : null
    : sortState
  const selectedIds = selectionControlled ? (selectedProp ?? []) : selectedState
  const expansionControlled = expandedProp !== undefined
  const expandedIds = expansionControlled ? expandedProp : expandedState
  const expandable = rows.some((row) => Boolean(row.detail))
  const lead = 1 + (expandable ? 1 : 0)
  const filtered = sortRows(filterRows(rows, query), sort)
  const size = typeof pageSize === 'number' && pageSize > 0 ? pageSize : 0
  const pages = pageCount(filtered.length, size)
  const safePage = Math.min(page, pages - 1)
  const ordered = pageRows(filtered, safePage, size)
  const empty = isTableEmpty(ordered)
  const sortedColumn = columns.find((column) => column.id === sort?.columnId)
  const sortStatus =
    sort && sortedColumn
      ? `Sorted by ${sortedColumn.header}, ${sort.direction === 'desc' ? 'descending' : 'ascending'}`
      : ''
  const selectionStatus =
    selectedIds.length === 1 ? '1 row selected' : selectedIds.length > 1 ? `${selectedIds.length} rows selected` : ''
  const matchStatus = !query.trim()
    ? ''
    : filtered.length === 1
      ? '1 row matches'
      : filtered.length > 1
        ? `${filtered.length} rows match`
        : ''
  const commitSort = (next: SortState) => {
    if (disabled) return
    if (!sortControlled) setSort(next)
    onSortChange?.(next)
  }
  const commitSelection = (next: string[]) => {
    if (disabled) return
    if (!selectionControlled) setSelectedIds(next)
    onSelectionChange?.(next)
  }
  const commitExpanded = (next: string[]) => {
    if (disabled) return
    if (!expansionControlled) setExpanded(next)
    onExpandedChange?.(next)
  }

  const changeQuery = (next: string) => {
    if (disabled) return
    setQuery(next)
    setPage(0)
    setActiveIndex(0)
    onQueryChange?.(next)
  }
  const changePage = (next: number) => {
    if (disabled || !size) return
    setPage(Math.min(Math.max(0, next), pages - 1))
    setActiveIndex(0)
  }

  return (
    <div>
      <input
        type="search"
        aria-label="Filter rows"
        value={query}
        disabled={disabled}
        onChange={(event) => changeQuery(event.target.value)}
      />
      {sortStatus ? <p role="status">{sortStatus}</p> : null}
    <table
      data-slot="data-table"
      aria-label={caption}
      className={cn('w-full text-sm', className)}
      onKeyDown={(event) => {
        if (disabled) return
        const next = reduceTableKey(event.key, ordered, { activeIndex, selectedIds })
        if (!next.handled) return
        event.preventDefault()
        setActiveIndex(next.activeIndex)
        commitSelection(next.selectedIds)
        const row = event.currentTarget.querySelectorAll('tbody tr[data-row]')[next.activeIndex]
        if (row instanceof HTMLElement) row.focus()
      }}
    >
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {expandable ? <th scope="col">Details</th> : null}
          <th scope="col">
            <input
              type="checkbox"
              aria-label="Select all rows"
              checked={allRowsSelected(ordered, selectedIds)}
              disabled={disabled}
              onChange={() => commitSelection(toggleAllSelection(ordered, selectedIds))}
            />
          </th>
          {columns.map((column) => {
            const active = sort?.columnId === column.id
            const ariaSort = !active ? 'none' : sort.direction === 'asc' ? 'ascending' : 'descending'
            return (
              <th key={column.id} scope="col" aria-sort={ariaSort}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => commitSort(cycleSort(sort, column.id))}
                >
                  {column.header}
                </button>
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {empty ? (
          <tr>
            <td colSpan={columns.length + lead} role="status">
              {emptyLabel}
            </td>
          </tr>
        ) : (
          ordered.map((row, index) => (
            <React.Fragment key={row.id}>
            <tr
              data-row=""
              tabIndex={disabled || index !== activeIndex ? -1 : 0}
              aria-disabled={disabled || undefined}
              aria-selected={selectedIds.includes(row.id)}
              onClick={() => setActiveIndex(index)}
            >
              {expandable ? (
                <td>
                  {row.detail ? (
                    <button
                      type="button"
                      aria-expanded={expandedIds.includes(row.id)}
                      aria-controls={`row-detail-${row.id}`}
                      disabled={disabled}
                      onKeyDown={(event) => event.stopPropagation()}
                      onClick={() => commitExpanded(toggleExpanded(expandedIds, row.id))}
                    >
                      {expandedIds.includes(row.id) ? `Collapse ${row.id}` : `Expand ${row.id}`}
                    </button>
                  ) : null}
                </td>
              ) : null}
              <td>
                <input
                  type="checkbox"
                  aria-label={`Select ${row.id}`}
                  checked={selectedIds.includes(row.id)}
                  disabled={disabled}
                  onChange={() => commitSelection(toggleRowSelection(selectedIds, row.id))}
                />
              </td>
              {columns.map((column) => (
                <td key={column.id}>{row.cells[column.id]}</td>
              ))}
            </tr>
            {expandable && row.detail && expandedIds.includes(row.id) ? (
              <tr>
                <td id={`row-detail-${row.id}`} colSpan={columns.length + lead}>
                  {row.detail}
                </td>
              </tr>
            ) : null}
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
      {size ? (
        <div>
          <p role="status">{`Page ${safePage + 1} of ${pages}`}</p>
          <button type="button" disabled={disabled || safePage === 0} onClick={() => changePage(safePage - 1)}>
            Previous page
          </button>
          <button type="button" disabled={disabled || safePage >= pages - 1} onClick={() => changePage(safePage + 1)}>
            Next page
          </button>
        </div>
      ) : null}
      {selectionStatus ? <p role="status">{selectionStatus}</p> : null}
      {matchStatus ? <p role="status">{matchStatus}</p> : null}
    </div>
  )
}

export { DataTable }
export type { DataTableProps }
