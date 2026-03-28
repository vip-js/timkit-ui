<script setup lang="ts">
import { computed, reactive } from 'vue'
import { cn } from '@timui/core'
import { Badge } from '@timui/vue'
import { Checkbox } from '@timui/vue'
import { Table } from '@timui/vue'
import { TableBody } from '@timui/vue'
import { TableCell } from '@timui/vue'
import { TableFooter } from '@timui/vue'
import { TableHead } from '@timui/vue'
import { TableHeader } from '@timui/vue'
import { TableRow } from '@timui/vue'
import { formatCurrency, tableUsers } from './table-demo-data'

const rows = tableUsers.slice(0, 8)
const selectedIds = reactive(new Set<string>())

function toChecked(value: unknown) {
  return !!((value as { detail?: { checked?: boolean } })?.detail?.checked ?? value)
}

const allSelected = computed(() => rows.length > 0 && rows.every((row) => selectedIds.has(row.id)))
const someSelected = computed(
  () => rows.some((row) => selectedIds.has(row.id)) && !allSelected.value
)

const totalBalance = computed(() => rows.reduce((total, row) => total + row.balance, 0))

function toggleAll(next: boolean) {
  selectedIds.clear()
  if (next) {
    rows.forEach((row) => selectedIds.add(row.id))
  }
}

function toggleRow(id: string, next: boolean) {
  if (next) {
    selectedIds.add(id)
  } else {
    selectedIds.delete(id)
  }
}
</script>

<template>
  <div>
    <Table>
      <TableHeader>
        <TableRow class="hover:bg-transparent">
          <TableHead>
            <Checkbox
              :checked="allSelected || (someSelected && 'indeterminate')"
              :onCheckedChange="(value: unknown) => toggleAll(toChecked(value))"
              aria-label="Select all"
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="row in rows"
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
          <TableCell>{{ row.email }}</TableCell>
          <TableCell>{{ row.flag }} {{ row.location }}</TableCell>
          <TableCell>
            <Badge
              :class="
                cn(
                  row.status === 'Inactive' && 'bg-muted-foreground/60 text-primary-foreground',
                  row.status === 'Pending' && 'bg-amber-500/20 text-amber-600'
                )
              "
            >
              {{ row.status }}
            </Badge>
          </TableCell>
          <TableCell class="text-right">{{ formatCurrency(row.balance) }}</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter class="bg-transparent">
        <TableRow class="hover:bg-transparent">
          <TableCell :colSpan="5">Total</TableCell>
          <TableCell class="text-right">{{ formatCurrency(totalBalance) }}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    <p class="text-muted-foreground mt-4 text-center text-sm">
      Basic data table made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
