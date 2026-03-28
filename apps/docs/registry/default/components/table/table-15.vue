<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeftToLineIcon, ArrowRightToLineIcon, PinOffIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Table } from '@timui/vue'
import { TableBody } from '@timui/vue'
import { TableCell } from '@timui/vue'
import { TableHead } from '@timui/vue'
import { TableHeader } from '@timui/vue'
import { TableRow } from '@timui/vue'
import { formatCurrency, tableUsers } from './table-demo-data'

type ColumnKey = 'name' | 'email' | 'location' | 'status' | 'balance'

type ColumnConfig = {
  key: ColumnKey
  label: string
  width: number
  align?: 'left' | 'right'
}

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Name', width: 180 },
  { key: 'email', label: 'Email', width: 220 },
  { key: 'location', label: 'Location', width: 180 },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'balance', label: 'Balance', width: 140, align: 'right' },
]

const rows = tableUsers.slice(0, 10)
const leftPinned = ref<ColumnKey | null>('name')
const rightPinned = ref<ColumnKey | null>('balance')

const tableWidth = computed(() => columns.reduce((total, column) => total + column.width, 0))

function pinLeft(key: ColumnKey) {
  leftPinned.value = key
  if (rightPinned.value === key) {
    rightPinned.value = null
  }
}

function pinRight(key: ColumnKey) {
  rightPinned.value = key
  if (leftPinned.value === key) {
    leftPinned.value = null
  }
}

function unpin(key: ColumnKey) {
  if (leftPinned.value === key) {
    leftPinned.value = null
  }

  if (rightPinned.value === key) {
    rightPinned.value = null
  }
}

function cellStyle(column: ColumnConfig) {
  const baseStyle: Record<string, string> = {
    width: `${column.width}px`,
  }

  if (leftPinned.value === column.key) {
    baseStyle.position = 'sticky'
    baseStyle.left = '0px'
    baseStyle.zIndex = '20'
    baseStyle.background = 'var(--background)'
  }

  if (rightPinned.value === column.key) {
    baseStyle.position = 'sticky'
    baseStyle.right = '0px'
    baseStyle.zIndex = '20'
    baseStyle.background = 'var(--background)'
  }

  return baseStyle
}

function rowValue(row: (typeof rows)[number], column: ColumnConfig) {
  if (column.key === 'balance') {
    return formatCurrency(row.balance)
  }

  if (column.key === 'location') {
    return `${row.flag} ${row.location}`
  }

  return row[column.key]
}
</script>

<template>
  <div>
    <Table
      class="[&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"
      :style="{ width: `${tableWidth}px` }"
    >
      <TableHeader>
        <TableRow class="bg-muted/50">
          <TableHead
            v-for="column in columns"
            :key="column.key"
            :style="cellStyle(column)"
            class="h-11"
          >
            <div class="flex items-center justify-between gap-2">
              <span>{{ column.label }}</span>
              <div class="flex items-center gap-1">
                <Button size="icon" variant="ghost" class="size-6" @click="pinLeft(column.key)" :aria-label="`Pin ${column.label} left`">
                  <ArrowLeftToLineIcon :size="14" />
                </Button>
                <Button size="icon" variant="ghost" class="size-6" @click="pinRight(column.key)" :aria-label="`Pin ${column.label} right`">
                  <ArrowRightToLineIcon :size="14" />
                </Button>
                <Button size="icon" variant="ghost" class="size-6" @click="unpin(column.key)" :aria-label="`Unpin ${column.label}`">
                  <PinOffIcon :size="14" />
                </Button>
              </div>
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-for="row in rows" :key="row.id">
          <TableCell
            v-for="column in columns"
            :key="`${row.id}-${column.key}`"
            :style="cellStyle(column)"
            :class="column.align === 'right' ? 'text-right' : undefined"
          >
            {{ rowValue(row, column) }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <p class="text-muted-foreground mt-4 text-center text-sm">
      Pinnable columns made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
