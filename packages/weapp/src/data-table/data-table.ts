import {
  allRowsSelected,
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

type TableEvent = {
  mark?: { columnId?: string; id?: string; key?: string }
  currentTarget?: { dataset?: { column?: string; id?: string } }
  detail?: { key?: string }
}

const rowsOf = (host: { properties?: { rows?: TableRowData[] } }) =>
  (host.properties?.rows ?? []) as TableRowData[]

Component({
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /^_/,
  },

  externalClasses: ['ext-class'],

  properties: {
    columns: { type: Array, value: [] as TableColumn[] },
    rows: { type: Array, value: [] as TableRowData[] },
    caption: { type: String, value: '' },
    emptyLabel: { type: String, value: 'No results' },
    disabled: { type: Boolean, value: false },
    sortColumn: { type: null, value: null },
    sortDirection: { type: null, value: null },
    selectedIds: { type: null, value: null },
    pageSize: { type: Number, value: 0 },
    expandedIds: { type: null, value: null },
    extClass: { type: String, value: '' },
  },

  data: {
    sort: null as SortState,
    selectedIds: [] as string[],
    activeIndex: 0,
    ordered: [] as TableRowData[],
    empty: true,
    headers: [] as Array<{ id: string; header: string; sort: string }>,
    sortStatus: '',
    selectionStatus: '',
    matchStatus: '',
    viewRows: [] as Array<{
      id: string
      cells: Array<{ columnId: string; text: string }>
      detail: string
      expanded: boolean
    }>,
    query: '',
    allSelected: false,
    page: 0,
    pageCount: 1,
    expandedIds: [] as string[],
    expandable: false,
  },

  lifetimes: {
    attached() {
      this.applySortFromProps()
      if (this.properties.sortColumn == null) {
        const ordered = this.orderedRows(this.data.sort)
        this.paint({ ordered, empty: isTableEmpty(ordered) })
      }
      this.applySelectedFromProps(this.properties.selectedIds)
    },
  },

  observers: {
    sortColumn() {
      this.applySortFromProps()
    },
    sortDirection() {
      this.applySortFromProps()
    },
    selectedIds(next: string[]) {
      this.applySelectedFromProps(next)
    },
    rows() {
      const ordered = this.orderedRows(this.data.sort)
      this.paint({ ordered, empty: isTableEmpty(ordered) })
    },
  },

  methods: {
    orderedRows(sort: SortState) {
      const filtered = sortRows(filterRows(rowsOf(this), String(this.data.query || '')), sort)
      return pageRows(filtered, Number(this.data.page) || 0, Number(this.properties.pageSize) || 0)
    },
    onFilter(event?: { detail?: { value?: string } }) {
      if (this.properties.disabled) return
      const query = String(event?.detail?.value ?? '')
      this.data.query = query
      this.data.page = 0
      const ordered = this.orderedRows(this.data.sort)
      this.paint({ query, page: 0, ordered, empty: isTableEmpty(ordered), activeIndex: 0 })
    },
    onPrevPage() {
      if (this.properties.disabled || !(Number(this.properties.pageSize) > 0)) return
      const page = Math.max(0, (Number(this.data.page) || 0) - 1)
      if (page === Number(this.data.page)) return
      this.data.page = page
      const ordered = this.orderedRows(this.data.sort)
      this.paint({ page, ordered, empty: isTableEmpty(ordered), activeIndex: 0 })
    },
    onNextPage() {
      if (this.properties.disabled || !(Number(this.properties.pageSize) > 0)) return
      const filtered = sortRows(filterRows(rowsOf(this), String(this.data.query || '')), this.data.sort)
      const pages = pageCount(filtered.length, Number(this.properties.pageSize) || 0)
      const page = Math.min((Number(this.data.page) || 0) + 1, pages - 1)
      if (page === Number(this.data.page)) return
      this.data.page = page
      const ordered = this.orderedRows(this.data.sort)
      this.paint({ page, ordered, empty: isTableEmpty(ordered), activeIndex: 0 })
    },
    onPrevPageKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onPrevPage()
    },
    onNextPageKey(event?: { detail?: { key?: string } }) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onNextPage()
    },
    applySortFromProps() {
      if (this.properties.sortColumn == null) return
      const column = String(this.properties.sortColumn)
      if (!column) {
        if (!this.data.sort) return
        const ordered = this.orderedRows(null)
        this.paint({ sort: null, ordered, empty: isTableEmpty(ordered), activeIndex: 0 })
        return
      }
      const direction = this.properties.sortDirection === 'desc' ? 'desc' : 'asc'
      if (this.data.sort?.columnId === column && this.data.sort.direction === direction) return
      const sort = { columnId: column, direction } as SortState
      const ordered = this.orderedRows(sort)
      this.paint({ sort, ordered, empty: isTableEmpty(ordered), activeIndex: 0 })
    },
    applySelectedFromProps(next: unknown) {
      if (next == null) return
      const ids = Array.isArray(next) ? next.map((item) => String(item)) : []
      const current = this.data.selectedIds ?? []
      if (ids.join('|') === current.join('|')) return
      this.setData({ selectedIds: ids, selectionStatus: this.selectionText(ids) })
    },
    selectionText(ids: readonly string[]) {
      if (ids.length === 1) return '1 row selected'
      if (ids.length > 1) return `${ids.length} rows selected`
      return ''
    },
    selectionControlled() {
      return this.properties.selectedIds != null
    },
    expansionControlled() {
      return this.properties.expandedIds != null
    },
    currentExpanded() {
      return (this.expansionControlled() ? this.properties.expandedIds : this.data.expandedIds) || []
    },
    onExpand(event?: TableEvent) {
      if (this.properties.disabled) return
      const id = String(event?.currentTarget?.dataset?.id || event?.mark?.id || '')
      if (!id) return
      const expandedIds = toggleExpanded(this.currentExpanded(), id)
      this.triggerEvent('expandedChange', { expandedIds })
      if (this.expansionControlled()) return
      this.paint({ expandedIds })
    },
    onExpandKey(event?: TableEvent) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onExpand(event)
    },
    emitSort(sort: SortState) {
      this.triggerEvent('sortChange', {
        sortColumn: sort?.columnId ?? '',
        sortDirection: sort?.direction ?? '',
      })
    },
    emitSelection(selectedIds: string[]) {
      this.triggerEvent('selectionChange', { selectedIds })
    },
    onSortKey(event?: TableEvent) {
      const key = String(event?.detail?.key || '')
      if (key === 'Enter' || key === ' ') this.onSort(event)
    },
    onToggleAllKey(event?: TableEvent) {
      const key = String(event?.detail?.key || '')
      if (key === ' ') this.onToggleAll()
    },
    onToggleRowKey(event?: TableEvent) {
      const key = String(event?.detail?.key || '')
      if (key === ' ') this.onToggleRow(event)
    },
    onSort(event?: TableEvent) {
      if (this.properties.disabled) return
      const columnId = String(event?.mark?.columnId || event?.currentTarget?.dataset?.column || '')
      if (!columnId) return
      const sort = cycleSort(this.data.sort, columnId)
      if (this.properties.sortColumn != null) {
        this.emitSort(sort)
        return
      }
      const ordered = this.orderedRows(sort)
      this.paint({ sort, ordered, empty: isTableEmpty(ordered), activeIndex: 0 })
      this.emitSort(sort)
    },
    onToggleRow(event?: TableEvent) {
      if (this.properties.disabled) return
      const id = String(event?.mark?.id || event?.currentTarget?.dataset?.id || '')
      if (!id) return
      const selectedIds = toggleRowSelection(this.data.selectedIds, id)
      if (this.selectionControlled()) {
        this.emitSelection(selectedIds)
        return
      }
      this.setData({ selectedIds, selectionStatus: this.selectionText(selectedIds) })
      this.emitSelection(selectedIds)
    },
    onToggleAll() {
      if (this.properties.disabled) return
      const ordered = this.orderedRows(this.data.sort)
      const selectedIds = toggleAllSelection(ordered, this.data.selectedIds)
      if (this.selectionControlled()) {
        this.emitSelection(selectedIds)
        return
      }
      this.setData({ selectedIds, selectionStatus: this.selectionText(selectedIds) })
      this.emitSelection(selectedIds)
    },
    onKey(event?: TableEvent) {
      if (this.properties.disabled) return
      const key = String(event?.detail?.key || event?.mark?.key || '')
      const ordered = this.orderedRows(this.data.sort)
      const next = reduceTableKey(key, ordered, {
        activeIndex: this.data.activeIndex,
        selectedIds: this.data.selectedIds,
      })
      if (!next.handled) return
      if (this.selectionControlled() && key === ' ') {
        this.emitSelection(next.selectedIds)
        this.setData({ activeIndex: next.activeIndex })
        return
      }
      this.setData({
        activeIndex: next.activeIndex,
        selectedIds: next.selectedIds,
        selectionStatus: this.selectionText(next.selectedIds),
      })
      if (key === ' ') this.emitSelection(next.selectedIds)
    },
    paint(update: Record<string, unknown>) {
      const ordered = (update.ordered ?? this.data.ordered ?? []) as TableRowData[]
      const sort = (
        Object.prototype.hasOwnProperty.call(update, 'sort') ? update.sort : this.data.sort
      ) as SortState
      const columns = (this.properties.columns ?? []) as TableColumn[]
      const sortedColumn = columns.find((column) => column.id === sort?.columnId)
      const sortStatus =
        sort && sortedColumn
          ? `Sorted by ${sortedColumn.header}, ${sort.direction === 'desc' ? 'descending' : 'ascending'}`
          : ''
      const headers = columns.map((column) => ({
        id: column.id,
        header: column.header,
        sort:
          !sort || sort.columnId !== column.id
            ? 'none'
            : sort.direction === 'desc'
              ? 'descending'
              : 'ascending',
      }))
      const selectedIds = (
        Object.prototype.hasOwnProperty.call(update, 'selectedIds') ? update.selectedIds : this.data.selectedIds
      ) as string[]
      const expandedIds = (
        Object.prototype.hasOwnProperty.call(update, 'expandedIds')
          ? update.expandedIds
          : this.currentExpanded()
      ) as string[]
      const viewRows = ordered.map((row) => ({
        id: String(row.id),
        cells: columns.map((column) => ({
          columnId: column.id,
          text: String(row.cells?.[column.id] ?? ''),
        })),
        detail: String(row.detail || ''),
        expanded: expandedIds.includes(String(row.id)),
      }))
      const filtered = sortRows(filterRows(rowsOf(this), String(this.data.query || '')), sort)
      const needle = String(this.data.query || '').trim()
      const matchStatus = !needle
        ? ''
        : filtered.length === 1
          ? '1 row matches'
          : filtered.length > 1
            ? `${filtered.length} rows match`
            : ''
      const pages = pageCount(filtered.length, Number(this.properties.pageSize) || 0)
      this.setData({
        ...update,
        headers,
        sortStatus,
        selectionStatus: this.selectionText(selectedIds || []),
        matchStatus,
        viewRows,
        expandedIds,
        expandable: rowsOf(this).some((row) => Boolean(row.detail)),
        pageCount: pages,
        allSelected: allRowsSelected(ordered, selectedIds || []),
      })
    },
  },
})
