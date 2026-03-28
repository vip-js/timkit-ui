<script setup lang="ts">
import { ref } from 'vue'
import { GripVerticalIcon } from 'lucide-vue-next'
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
}

const columns = ref<ColumnConfig[]>([
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'balance', label: 'Balance' },
])

const rows = tableUsers.slice(0, 10)
const draggingColumn = ref<ColumnKey | null>(null)

function startDrag(key: ColumnKey) {
  draggingColumn.value = key
}

function allowDrop(event: DragEvent) {
  event.preventDefault()
}

function dropOn(key: ColumnKey) {
  if (!draggingColumn.value || draggingColumn.value === key) {
    return
  }

  const from = columns.value.findIndex((column) => column.key === draggingColumn.value)
  const to = columns.value.findIndex((column) => column.key === key)

  if (from < 0 || to < 0) {
    draggingColumn.value = null
    return
  }

  const next = [...columns.value]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)
  columns.value = next
  draggingColumn.value = null
}

function dragEnd() {
  draggingColumn.value = null
}

function valueFor(row: (typeof rows)[number], key: ColumnKey) {
  if (key === 'balance') {
    return formatCurrency(row.balance)
  }

  if (key === 'location') {
    return `${row.flag} ${row.location}`
  }

  return row[key]
}
</script>

<template>
  <div>
    <Table>
      <TableHeader>
        <TableRow class="bg-muted/50">
          <TableHead
            v-for="column in columns"
            :key="column.key"
            draggable="true"
            class="select-none"
            :data-dragging="draggingColumn === column.key ? true : undefined"
            @dragstart="startDrag(column.key)"
            @dragover="allowDrop"
            @drop="dropOn(column.key)"
            @dragend="dragEnd"
          >
            <span class="inline-flex items-center gap-2">
              <GripVerticalIcon class="opacity-60" :size="14" />
              {{ column.label }}
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-for="row in rows" :key="row.id">
          <TableCell v-for="column in columns" :key="`${row.id}-${column.key}`" :class="column.key === 'balance' ? 'text-right' : undefined">
            {{ valueFor(row, column.key) }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <p class="text-muted-foreground mt-4 text-center text-sm">
      Draggable columns made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
