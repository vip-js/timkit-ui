export type TableColumn = { id: string; header: string }

export type TableRowData = { id: string; cells: Record<string, string>; detail?: string }

export type SortState = { columnId: string; direction: 'asc' | 'desc' } | null

export type TableCursor = { activeIndex: number; selectedIds: string[] }

const compareValues = (left: string, right: string) => {
  const leftNumber = Number(left)
  const rightNumber = Number(right)
  if (left !== '' && right !== '' && Number.isFinite(leftNumber) && Number.isFinite(rightNumber)) {
    return leftNumber - rightNumber
  }
  return left.localeCompare(right)
}

export const sortRows = (rows: readonly TableRowData[], sort: SortState) => {
  if (!sort) return rows.slice()
  return rows.slice().sort((left, right) => {
    const base = compareValues(left.cells[sort.columnId] ?? '', right.cells[sort.columnId] ?? '')
    const directed = sort.direction === 'asc' ? base : -base
    return directed || left.id.localeCompare(right.id)
  })
}

export const cycleSort = (current: SortState, columnId: string): SortState => {
  if (!current || current.columnId !== columnId) return { columnId, direction: 'asc' }
  if (current.direction === 'asc') return { columnId, direction: 'desc' }
  return null
}

export const toggleRowSelection = (selected: readonly string[], id: string) =>
  selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]

export const toggleAllSelection = (rows: readonly TableRowData[], selected: readonly string[]) => {
  if (rows.length > 0 && rows.every((row) => selected.includes(row.id))) return []
  return rows.map((row) => row.id)
}

export const filterRows = (rows: readonly TableRowData[], query: string) => {
  const needle = query.trim().toLowerCase()
  if (!needle) return rows.slice()
  return rows.filter((row) =>
    Object.values(row.cells).some((value) => String(value).toLowerCase().includes(needle))
  )
}

export const allRowsSelected = (rows: readonly TableRowData[], selected: readonly string[]) =>
  rows.length > 0 && rows.every((row) => selected.includes(row.id))

export const toggleExpanded = (expanded: readonly string[], id: string) =>
  expanded.includes(id) ? expanded.filter((item) => item !== id) : [...expanded, id]

export const pageCount = (count: number, pageSize: number) => {
  if (!Number.isFinite(pageSize) || pageSize < 1) return 1
  return Math.max(1, Math.ceil(count / pageSize))
}

export const pageRows = <T,>(rows: readonly T[], page: number, pageSize: number) => {
  if (!Number.isFinite(pageSize) || pageSize < 1) return rows.slice()
  const pages = pageCount(rows.length, pageSize)
  const index = Math.min(Math.max(0, page), pages - 1)
  const start = index * pageSize
  return rows.slice(start, start + pageSize)
}

export const isTableEmpty = (rows: readonly unknown[]) => rows.length === 0

export const reduceTableKey = (
  key: string,
  rows: readonly TableRowData[],
  cursor: TableCursor
): TableCursor & { handled: boolean } => {
  if (rows.length === 0) return { ...cursor, handled: false }
  const index = Math.min(Math.max(cursor.activeIndex, 0), rows.length - 1)
  if (key === 'ArrowDown') {
    return {
      activeIndex: Math.min(rows.length - 1, index + 1),
      selectedIds: cursor.selectedIds,
      handled: true,
    }
  }
  if (key === 'ArrowUp') {
    return { activeIndex: Math.max(0, index - 1), selectedIds: cursor.selectedIds, handled: true }
  }
  if (key === 'Home') return { activeIndex: 0, selectedIds: cursor.selectedIds, handled: true }
  if (key === 'End') {
    return { activeIndex: rows.length - 1, selectedIds: cursor.selectedIds, handled: true }
  }
  if (key === ' ') {
    const id = rows[index]?.id
    if (!id) return { ...cursor, activeIndex: index, handled: false }
    return { activeIndex: index, selectedIds: toggleRowSelection(cursor.selectedIds, id), handled: true }
  }
  return { ...cursor, activeIndex: index, handled: false }
}
