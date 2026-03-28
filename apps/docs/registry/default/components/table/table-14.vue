<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next'
import { Input } from '@timui/vue'
import { Table } from '@timui/vue'
import { TableBody } from '@timui/vue'
import { TableCell } from '@timui/vue'
import { TableHead } from '@timui/vue'
import { TableHeader } from '@timui/vue'
import { TableRow } from '@timui/vue'
import { formatCurrency, tableUsers, type TableUser } from './table-demo-data'

type SortKey = 'name' | 'email' | 'location' | 'status' | 'balance' | 'performance'

const sortKey = ref<SortKey>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

const widths = ref({
  name: 180,
  email: 220,
  location: 180,
  status: 120,
  balance: 120,
  performance: 140,
})

const rows = computed(() => {
  return [...tableUsers].sort((left, right) => {
    let leftValue: string | number = left[sortKey.value as keyof TableUser] as string | number
    let rightValue: string | number = right[sortKey.value as keyof TableUser] as string | number

    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
      const result = leftValue.localeCompare(rightValue)
      return sortDirection.value === 'asc' ? result : -result
    }

    const result = Number(leftValue) - Number(rightValue)
    return sortDirection.value === 'asc' ? result : -result
  })
})

function toggleSort(next: SortKey) {
  if (sortKey.value === next) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortKey.value = next
  sortDirection.value = 'asc'
}

function sortIcon(column: SortKey) {
  if (sortKey.value !== column) {
    return null
  }

  return sortDirection.value === 'asc' ? ChevronUpIcon : ChevronDownIcon
}
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      <label class="text-sm">
        Name Width
        <Input type="range" min="120" max="260" :value="widths.name" @input="widths.name = Number(($event.target as HTMLInputElement).value)" />
      </label>
      <label class="text-sm">
        Email Width
        <Input type="range" min="160" max="320" :value="widths.email" @input="widths.email = Number(($event.target as HTMLInputElement).value)" />
      </label>
      <label class="text-sm">
        Location Width
        <Input type="range" min="120" max="260" :value="widths.location" @input="widths.location = Number(($event.target as HTMLInputElement).value)" />
      </label>
    </div>

    <Table class="table-fixed" :style="{ width: `${widths.name + widths.email + widths.location + widths.status + widths.balance + widths.performance}px` }">
      <TableHeader>
        <TableRow class="bg-muted/50">
          <TableHead class="cursor-pointer select-none" :style="{ width: `${widths.name}px` }" @click="toggleSort('name')">
            <span class="flex items-center justify-between gap-2">
              Name
              <component :is="sortIcon('name')" v-if="sortIcon('name')" :size="16" />
            </span>
          </TableHead>
          <TableHead class="cursor-pointer select-none" :style="{ width: `${widths.email}px` }" @click="toggleSort('email')">
            <span class="flex items-center justify-between gap-2">
              Email
              <component :is="sortIcon('email')" v-if="sortIcon('email')" :size="16" />
            </span>
          </TableHead>
          <TableHead class="cursor-pointer select-none" :style="{ width: `${widths.location}px` }" @click="toggleSort('location')">
            <span class="flex items-center justify-between gap-2">
              Location
              <component :is="sortIcon('location')" v-if="sortIcon('location')" :size="16" />
            </span>
          </TableHead>
          <TableHead class="cursor-pointer select-none" :style="{ width: `${widths.status}px` }" @click="toggleSort('status')">
            <span class="flex items-center justify-between gap-2">
              Status
              <component :is="sortIcon('status')" v-if="sortIcon('status')" :size="16" />
            </span>
          </TableHead>
          <TableHead class="cursor-pointer select-none text-right" :style="{ width: `${widths.balance}px` }" @click="toggleSort('balance')">
            <span class="flex items-center justify-end gap-2">
              Balance
              <component :is="sortIcon('balance')" v-if="sortIcon('balance')" :size="16" />
            </span>
          </TableHead>
          <TableHead class="cursor-pointer select-none" :style="{ width: `${widths.performance}px` }" @click="toggleSort('performance')">
            <span class="flex items-center justify-between gap-2">
              Performance
              <component :is="sortIcon('performance')" v-if="sortIcon('performance')" :size="16" />
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow v-for="row in rows" :key="row.id">
          <TableCell :style="{ width: `${widths.name}px` }" class="truncate font-medium">{{ row.name }}</TableCell>
          <TableCell :style="{ width: `${widths.email}px` }" class="truncate">{{ row.email }}</TableCell>
          <TableCell :style="{ width: `${widths.location}px` }" class="truncate">{{ row.flag }} {{ row.location }}</TableCell>
          <TableCell :style="{ width: `${widths.status}px` }">{{ row.status }}</TableCell>
          <TableCell :style="{ width: `${widths.balance}px` }" class="text-right">{{ formatCurrency(row.balance) }}</TableCell>
          <TableCell :style="{ width: `${widths.performance}px` }">{{ row.performance }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <p class="text-muted-foreground mt-4 text-center text-sm">
      Resizable and sortable columns made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
