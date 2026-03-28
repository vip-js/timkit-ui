<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  Columns3Icon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-vue-next'
import { Badge } from '@timui/vue'
import { Button } from '@timui/vue'
import { Checkbox } from '@timui/vue'
import { Input } from '@timui/vue'
import { Label } from '@timui/vue'
import { Popover, PopoverContent, PopoverTrigger } from '@timui/vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue'
import { Table } from '@timui/vue'
import { TableBody } from '@timui/vue'
import { TableCell } from '@timui/vue'
import { TableHead } from '@timui/vue'
import { TableHeader } from '@timui/vue'
import { TableRow } from '@timui/vue'
import { formatCurrency, tableUsers, type TableUser } from './table-demo-data'

const data = ref<TableUser[]>([...tableUsers])
const selectedIds = reactive(new Set<string>())
const searchValue = ref('')
const statusFilters = reactive(new Set<TableUser['status']>())
const pageIndex = ref(0)
const pageSize = ref(10)

const columnVisibility = reactive({
  email: true,
  location: true,
  status: true,
  performance: true,
  balance: true,
})

type OptionalColumnKey = keyof typeof columnVisibility

const optionalColumns: Array<{ key: OptionalColumnKey; label: string }> = [
  { key: 'email', label: 'Email' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'performance', label: 'Performance' },
  { key: 'balance', label: 'Balance' },
]

function toChecked(value: unknown) {
  return !!((value as { detail?: { checked?: boolean } })?.detail?.checked ?? value)
}

const filteredRows = computed(() => {
  const keyword = searchValue.value.trim().toLowerCase()

  return data.value.filter((row) => {
    const matchesKeyword =
      keyword.length === 0 ||
      row.name.toLowerCase().includes(keyword) ||
      row.email.toLowerCase().includes(keyword)

    const matchesStatus =
      statusFilters.size === 0 || statusFilters.has(row.status)

    return matchesKeyword && matchesStatus
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize.value)))

const pagedRows = computed(() => {
  const start = pageIndex.value * pageSize.value
  return filteredRows.value.slice(start, start + pageSize.value)
})

const allPageSelected = computed(
  () => pagedRows.value.length > 0 && pagedRows.value.every((row) => selectedIds.has(row.id))
)

const somePageSelected = computed(
  () => pagedRows.value.some((row) => selectedIds.has(row.id)) && !allPageSelected.value
)

const selectedCount = computed(() => selectedIds.size)

const visibleColumns = computed(() => optionalColumns.filter((column) => columnVisibility[column.key]))

const uniqueStatusValues = computed(() => ['Active', 'Inactive', 'Pending'] as Array<TableUser['status']>)

const rangeLabel = computed(() => {
  const start = pageIndex.value * pageSize.value + 1
  const end = Math.min(start + pageSize.value - 1, filteredRows.value.length)
  return `${start}-${end} of ${filteredRows.value.length}`
})

function toggleAllPageRows(next: boolean) {
  if (next) {
    pagedRows.value.forEach((row) => selectedIds.add(row.id))
    return
  }

  pagedRows.value.forEach((row) => selectedIds.delete(row.id))
}

function toggleRow(id: string, next: boolean) {
  if (next) {
    selectedIds.add(id)
  } else {
    selectedIds.delete(id)
  }
}

function toggleStatusFilter(status: TableUser['status'], checked: boolean) {
  if (checked) {
    statusFilters.add(status)
  } else {
    statusFilters.delete(status)
  }

  pageIndex.value = 0
}

function clearSearch() {
  searchValue.value = ''
  pageIndex.value = 0
}

function toggleColumn(key: OptionalColumnKey, checked: boolean) {
  columnVisibility[key] = checked
}

function deleteSelected() {
  if (selectedIds.size === 0) return

  data.value = data.value.filter((row) => !selectedIds.has(row.id))
  selectedIds.clear()

  if (pageIndex.value >= pageCount.value - 1) {
    pageIndex.value = Math.max(0, pageCount.value - 1)
  }
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

function changePageSize(value: string) {
  pageSize.value = Number(value)
  pageIndex.value = 0
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="relative">
          <Input
            class="peer min-w-60 ps-9"
            :class="searchValue ? 'pe-9' : undefined"
            :value="searchValue"
            placeholder="Filter by name or email..."
            type="text"
            aria-label="Filter by name or email"
            @input="searchValue = ($event.target as HTMLInputElement).value"
          />
          <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
            <ListFilterIcon :size="16" aria-hidden="true" />
          </div>
          <button
            v-if="searchValue"
            class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px]"
            aria-label="Clear filter"
            @click="clearSearch"
          >
            <CircleXIcon :size="16" aria-hidden="true" />
          </button>
        </div>

        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">
              <FilterIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />
              Status
              <span
                v-if="statusFilters.size > 0"
                class="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 text-[0.625rem] font-medium"
              >
                {{ statusFilters.size }}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto min-w-36 p-3" align="start">
            <div class="space-y-3">
              <div class="text-muted-foreground text-xs font-medium">Filters</div>
              <div class="space-y-3">
                <div v-for="status in uniqueStatusValues" :key="status" class="flex items-center gap-2">
                  <Checkbox
                    :id="`status-${status}`"
                    :checked="statusFilters.has(status)"
                    :onCheckedChange="(value: unknown) => toggleStatusFilter(status, toChecked(value))"
                  />
                  <Label :for="`status-${status}`" class="font-normal">{{ status }}</Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">
              <Columns3Icon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />
              View
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto min-w-36 p-3" align="start">
            <div class="space-y-3">
              <div class="text-muted-foreground text-xs font-medium">Toggle columns</div>
              <div class="space-y-3">
                <div v-for="column in optionalColumns" :key="column.key" class="flex items-center gap-2">
                  <Checkbox
                    :id="`column-${column.key}`"
                    :checked="columnVisibility[column.key]"
                    :onCheckedChange="(value: unknown) => toggleColumn(column.key, toChecked(value))"
                  />
                  <Label :for="`column-${column.key}`" class="font-normal">{{ column.label }}</Label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div class="flex items-center gap-3">
        <Button v-if="selectedCount > 0" variant="outline" @click="deleteSelected">
          <TrashIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />
          Delete
          <span class="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 text-[0.625rem] font-medium">
            {{ selectedCount }}
          </span>
        </Button>

        <Button variant="outline">
          <PlusIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />
          Add user
        </Button>
      </div>
    </div>

    <div class="bg-background overflow-hidden rounded-md border">
      <Table class="table-fixed">
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead class="h-11 w-10">
              <Checkbox
                :checked="allPageSelected || (somePageSelected && 'indeterminate')"
                :onCheckedChange="(value: unknown) => toggleAllPageRows(toChecked(value))"
                aria-label="Select all"
              />
            </TableHead>
            <TableHead class="h-11">Name</TableHead>
            <TableHead v-for="column in visibleColumns" :key="column.key" class="h-11">
              {{ column.label }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="pagedRows.length > 0">
            <TableRow
              v-for="row in pagedRows"
              :key="row.id"
              :data-state="selectedIds.has(row.id) ? 'selected' : undefined"
            >
              <TableCell>
                <Checkbox
                  :checked="selectedIds.has(row.id)"
                  :onCheckedChange="(value: unknown) => toggleRow(row.id, toChecked(value))"
                  :aria-label="`Select ${row.name}`"
                />
              </TableCell>

              <TableCell class="font-medium">{{ row.name }}</TableCell>

              <TableCell v-if="columnVisibility.email">{{ row.email }}</TableCell>
              <TableCell v-if="columnVisibility.location">{{ row.flag }} {{ row.location }}</TableCell>
              <TableCell v-if="columnVisibility.status">
                <Badge
                  :class="
                    row.status === 'Inactive'
                      ? 'bg-muted-foreground/60 text-primary-foreground'
                      : row.status === 'Pending'
                        ? 'bg-amber-500/20 text-amber-600'
                        : undefined
                  "
                >
                  {{ row.status }}
                </Badge>
              </TableCell>
              <TableCell v-if="columnVisibility.performance">{{ row.performance }}</TableCell>
              <TableCell v-if="columnVisibility.balance" class="text-right">{{ formatCurrency(row.balance) }}</TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow>
              <TableCell :colSpan="visibleColumns.length + 2" class="h-24 text-center">No results.</TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between gap-8">
      <div class="flex items-center gap-3">
        <Label for="table-20-page-size" class="max-sm:sr-only">Rows per page</Label>
        <Select :value="String(pageSize)" @update:modelValue="changePageSize">
          <SelectTrigger id="table-20-page-size" class="w-fit whitespace-nowrap">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
        <p aria-live="polite">{{ rangeLabel }}</p>
      </div>

      <div class="flex items-center gap-2">
        <Button size="icon" variant="outline" :disabled="pageIndex === 0" aria-label="Go to first page" @click="firstPage">
          <ChevronFirstIcon :size="16" aria-hidden="true" />
        </Button>
        <Button size="icon" variant="outline" :disabled="pageIndex === 0" aria-label="Go to previous page" @click="previousPage">
          <ChevronLeftIcon :size="16" aria-hidden="true" />
        </Button>
        <Button size="icon" variant="outline" :disabled="pageIndex >= pageCount - 1" aria-label="Go to next page" @click="nextPage">
          <ChevronRightIcon :size="16" aria-hidden="true" />
        </Button>
        <Button size="icon" variant="outline" :disabled="pageIndex >= pageCount - 1" aria-label="Go to last page" @click="lastPage">
          <ChevronLastIcon :size="16" aria-hidden="true" />
        </Button>
      </div>
    </div>

    <p class="text-muted-foreground mt-4 text-center text-sm">
      Example of a more complex table made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
