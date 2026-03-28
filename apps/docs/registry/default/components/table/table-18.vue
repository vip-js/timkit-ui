<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDownIcon, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Label } from '@timui/vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue'
import { Table } from '@timui/vue'
import { TableBody } from '@timui/vue'
import { TableCell } from '@timui/vue'
import { TableHead } from '@timui/vue'
import { TableHeader } from '@timui/vue'
import { TableRow } from '@timui/vue'
import { formatCurrency, tableUsers } from './table-demo-data'

type SortKey = 'name' | 'email' | 'location' | 'status' | 'balance'

const sortKey = ref<SortKey>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const pageIndex = ref(0)
const pageSize = ref(5)

const sortedRows = computed(() => {
  return [...tableUsers].sort((left, right) => {
    const leftValue = left[sortKey.value]
    const rightValue = right[sortKey.value]

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return sortDirection.value === 'asc' ? leftValue - rightValue : rightValue - leftValue
    }

    const result = String(leftValue).localeCompare(String(rightValue))
    return sortDirection.value === 'asc' ? result : -result
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value)))

const pagedRows = computed(() => {
  const start = pageIndex.value * pageSize.value
  return sortedRows.value.slice(start, start + pageSize.value)
})

const rangeLabel = computed(() => {
  const start = pageIndex.value * pageSize.value + 1
  const end = Math.min(start + pageSize.value - 1, sortedRows.value.length)
  return `${start}-${end} of ${sortedRows.value.length}`
})

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortKey.value = key
  sortDirection.value = 'asc'
}

function changePageSize(value: string) {
  pageSize.value = Number(value)
  pageIndex.value = 0
}

function firstPage() {
  pageIndex.value = 0
}

function previousPage() {
  pageIndex.value = Math.max(0, pageIndex.value - 1)
}

function nextPage() {
  pageIndex.value = Math.min(pageCount.value - 1, pageIndex.value + 1)
}

function lastPage() {
  pageIndex.value = pageCount.value - 1
}

function sortIcon(key: SortKey) {
  if (sortKey.value !== key) return null
  return sortDirection.value === 'asc' ? ChevronUpIcon : ChevronDownIcon
}
</script>

<template>
  <div class="space-y-4">
    <div class="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead class="h-11 cursor-pointer" @click="toggleSort('name')">
              <span class="flex items-center gap-1">Name <component :is="sortIcon('name')" v-if="sortIcon('name')" :size="14" /></span>
            </TableHead>
            <TableHead class="h-11 cursor-pointer" @click="toggleSort('email')">
              <span class="flex items-center gap-1">Email <component :is="sortIcon('email')" v-if="sortIcon('email')" :size="14" /></span>
            </TableHead>
            <TableHead class="h-11 cursor-pointer" @click="toggleSort('location')">
              <span class="flex items-center gap-1">Location <component :is="sortIcon('location')" v-if="sortIcon('location')" :size="14" /></span>
            </TableHead>
            <TableHead class="h-11 cursor-pointer" @click="toggleSort('status')">
              <span class="flex items-center gap-1">Status <component :is="sortIcon('status')" v-if="sortIcon('status')" :size="14" /></span>
            </TableHead>
            <TableHead class="h-11 cursor-pointer text-right" @click="toggleSort('balance')">
              <span class="flex items-center justify-end gap-1">Balance <component :is="sortIcon('balance')" v-if="sortIcon('balance')" :size="14" /></span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="row in pagedRows" :key="row.id">
            <TableCell class="font-medium">{{ row.name }}</TableCell>
            <TableCell>{{ row.email }}</TableCell>
            <TableCell>{{ row.flag }} {{ row.location }}</TableCell>
            <TableCell>{{ row.status }}</TableCell>
            <TableCell class="text-right">{{ formatCurrency(row.balance) }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between gap-4 max-sm:flex-col">
      <p class="text-muted-foreground text-sm" aria-live="polite">{{ rangeLabel }}</p>

      <div class="flex items-center gap-2">
        <Button size="icon" variant="outline" :disabled="pageIndex === 0" @click="firstPage" aria-label="Go to first page">
          <ChevronFirstIcon :size="16" />
        </Button>
        <Button size="icon" variant="outline" :disabled="pageIndex === 0" @click="previousPage" aria-label="Go to previous page">
          <ChevronLeftIcon :size="16" />
        </Button>
        <Button size="icon" variant="outline" :disabled="pageIndex >= pageCount - 1" @click="nextPage" aria-label="Go to next page">
          <ChevronRightIcon :size="16" />
        </Button>
        <Button size="icon" variant="outline" :disabled="pageIndex >= pageCount - 1" @click="lastPage" aria-label="Go to last page">
          <ChevronLastIcon :size="16" />
        </Button>
      </div>

      <div class="flex items-center gap-2">
        <Label for="table-18-page-size">Rows per page</Label>
        <Select :value="String(pageSize)" @update:modelValue="changePageSize">
          <SelectTrigger id="table-18-page-size" class="w-[120px]">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <p class="text-muted-foreground mt-4 text-center text-sm">
      Paginated table made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
