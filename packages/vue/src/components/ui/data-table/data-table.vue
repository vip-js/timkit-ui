<script setup lang="ts">
import { computed, ref } from 'vue'

import { usePassedProp } from '../../../hooks/passed-prop'
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

const props = withDefaults(
  defineProps<{
    columns: TableColumn[]
    rows: TableRowData[]
    caption: string
    emptyLabel?: string
    class?: string
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
  }>(),
  { emptyLabel: 'No results' }
)

const sortState = ref<SortState>(null)
const selectedState = ref<string[]>([])
const activeIndex = ref(0)
const query = ref('')
const page = ref(0)
const expandedState = ref<string[]>([])
const table = ref<HTMLTableElement | null>(null)
const passed = usePassedProp()
const readSelected = () => {
  const explicit = passed<string[] | null>(props, 'selectedIds')
  return explicit !== undefined ? explicit : props.selectedIds
}
const sort = computed<SortState>(() => {
  if (props.sortColumn === undefined) return sortState.value
  if (!props.sortColumn) return null
  return { columnId: props.sortColumn, direction: props.sortDirection === 'desc' ? 'desc' : 'asc' }
})
const selectedIds = computed(() => {
  const value = readSelected()
  return value === undefined ? selectedState.value : (value ?? [])
})
const readExpanded = () => passed<string[] | undefined>(props, 'expandedIds')
const expandedIds = computed(() => {
  const value = readExpanded()
  return value === undefined ? expandedState.value : value
})
const expandable = computed(() => props.rows.some((row) => Boolean(row.detail)))
const lead = computed(() => 1 + (expandable.value ? 1 : 0))
const filtered = computed(() => sortRows(filterRows(props.rows, query.value), sort.value))
const size = computed(() => (typeof props.pageSize === 'number' && props.pageSize > 0 ? props.pageSize : 0))
const pages = computed(() => pageCount(filtered.value.length, size.value))
const safePage = computed(() => Math.min(page.value, pages.value - 1))
const ordered = computed(() => pageRows(filtered.value, safePage.value, size.value))
const empty = computed(() => isTableEmpty(ordered.value))
const allSelected = computed(() => allRowsSelected(ordered.value, selectedIds.value))
const changeQuery = (event: Event) => {
  if (props.disabled) return
  const next = event.target instanceof HTMLInputElement ? event.target.value : ''
  query.value = next
  page.value = 0
  activeIndex.value = 0
  props.onQueryChange?.(next)
}
const changePage = (next: number) => {
  if (props.disabled || !size.value) return
  page.value = Math.min(Math.max(0, next), pages.value - 1)
  activeIndex.value = 0
}

const commitSort = (next: SortState) => {
  if (props.disabled) return
  if (props.sortColumn === undefined) sortState.value = next
  props.onSortChange?.(next)
}
const commitSelection = (next: string[]) => {
  if (props.disabled) return
  if (readSelected() === undefined) selectedState.value = next
  props.onSelectionChange?.(next)
}
const commitExpanded = (next: string[]) => {
  if (props.disabled) return
  if (readExpanded() === undefined) expandedState.value = next
  props.onExpandedChange?.(next)
}

const sortStatus = computed(() => {
  const current = sort.value
  const column = props.columns.find((item) => item.id === current?.columnId)
  if (!current || !column) return ''
  return `Sorted by ${column.header}, ${current.direction === 'desc' ? 'descending' : 'ascending'}`
})
const selectionStatus = computed(() => {
  const count = selectedIds.value.length
  if (count === 1) return '1 row selected'
  if (count > 1) return `${count} rows selected`
  return ''
})
const matchStatus = computed(() => {
  if (!query.value.trim()) return ''
  const count = filtered.value.length
  if (count === 1) return '1 row matches'
  if (count > 1) return `${count} rows match`
  return ''
})
const ariaSort = (columnId: string) => {
  if (sort.value?.columnId !== columnId) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

const onKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return
  const next = reduceTableKey(event.key, ordered.value, {
    activeIndex: activeIndex.value,
    selectedIds: selectedIds.value,
  })
  if (!next.handled) return
  event.preventDefault()
  activeIndex.value = next.activeIndex
  commitSelection(next.selectedIds)
  const row = table.value?.querySelectorAll('tbody tr[data-row]')[next.activeIndex]
  if (row instanceof HTMLElement) row.focus()
}
</script>

<template>
  <div>
    <input
      type="search"
      aria-label="Filter rows"
      :value="query"
      :disabled="disabled"
      @input="changeQuery"
    />
    <p v-if="sortStatus" role="status">{{ sortStatus }}</p>
  <table
    ref="table"
    data-slot="data-table"
    :aria-label="caption"
    :class="cn('w-full text-sm', props.class)"
    @keydown="onKeyDown"
  >
    <caption class="sr-only">{{ caption }}</caption>
    <thead>
      <tr>
        <th v-if="expandable" scope="col">Details</th>
        <th scope="col">
          <input
            type="checkbox"
            aria-label="Select all rows"
            :checked="allSelected"
            :disabled="disabled"
            @change="commitSelection(toggleAllSelection(ordered, selectedIds))"
          />
        </th>
        <th v-for="column in columns" :key="column.id" scope="col" :aria-sort="ariaSort(column.id)">
          <button type="button" :disabled="disabled" @click="commitSort(cycleSort(sort, column.id))">
            {{ column.header }}
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="empty">
        <td :colspan="columns.length + lead" role="status">{{ emptyLabel }}</td>
      </tr>
      <template v-for="(row, index) in ordered" v-else :key="row.id">
      <tr
        data-row=""
        :tabindex="disabled || index !== activeIndex ? -1 : 0"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-selected="selectedIds.includes(row.id)"
        @click="activeIndex = index"
      >
        <td v-if="expandable">
          <button
            v-if="row.detail"
            type="button"
            :aria-expanded="expandedIds.includes(row.id)"
            :aria-controls="`row-detail-${row.id}`"
            :disabled="disabled"
            @keydown.stop
            @click="commitExpanded(toggleExpanded(expandedIds, row.id))"
          >
            {{ expandedIds.includes(row.id) ? `Collapse ${row.id}` : `Expand ${row.id}` }}
          </button>
        </td>
        <td>
          <input
            type="checkbox"
            :aria-label="`Select ${row.id}`"
            :checked="selectedIds.includes(row.id)"
            :disabled="disabled"
            @change="commitSelection(toggleRowSelection(selectedIds, row.id))"
          />
        </td>
        <td v-for="column in columns" :key="column.id">{{ row.cells[column.id] }}</td>
      </tr>
      <tr v-if="expandable && row.detail && expandedIds.includes(row.id)">
        <td :id="`row-detail-${row.id}`" :colspan="columns.length + lead">{{ row.detail }}</td>
      </tr>
      </template>
    </tbody>
  </table>
    <div v-if="size">
      <p role="status">{{ `Page ${safePage + 1} of ${pages}` }}</p>
      <button type="button" :disabled="disabled || safePage === 0" @click="changePage(safePage - 1)">
        Previous page
      </button>
      <button type="button" :disabled="disabled || safePage >= pages - 1" @click="changePage(safePage + 1)">
        Next page
      </button>
    </div>
    <p v-if="selectionStatus" role="status">{{ selectionStatus }}</p>
    <p v-if="matchStatus" role="status">{{ matchStatus }}</p>
  </div>
</template>
