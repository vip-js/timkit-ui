<script setup lang="ts">
import { reactive } from 'vue'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-vue-next'
import { Table } from '@timui/vue'
import { TableBody } from '@timui/vue'
import { TableCell } from '@timui/vue'
import { TableHead } from '@timui/vue'
import { TableHeader } from '@timui/vue'
import { TableRow } from '@timui/vue'
import { formatCurrency, tableUsers } from './table-demo-data'

const rows = tableUsers.slice(0, 8)
const expandedIds = reactive(new Set<string>())

function toggleRow(id: string) {
  if (expandedIds.has(id)) {
    expandedIds.delete(id)
  } else {
    expandedIds.add(id)
  }
}
</script>

<template>
  <div>
    <Table>
      <TableHeader>
        <TableRow class="bg-muted/50">
          <TableHead class="w-10" />
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead class="text-right">Balance</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-for="row in rows" :key="row.id">
          <TableRow :data-state="expandedIds.has(row.id) ? 'expanded' : undefined">
            <TableCell>
              <button class="inline-flex h-6 w-6 items-center justify-center" :aria-label="`Toggle ${row.name}`" @click="toggleRow(row.id)">
                <ChevronDownIcon v-if="expandedIds.has(row.id)" :size="14" />
                <ChevronRightIcon v-else :size="14" />
              </button>
            </TableCell>
            <TableCell class="font-medium">{{ row.name }}</TableCell>
            <TableCell>{{ row.email }}</TableCell>
            <TableCell>{{ row.flag }} {{ row.location }}</TableCell>
            <TableCell>{{ row.status }}</TableCell>
            <TableCell class="text-right">{{ formatCurrency(row.balance) }}</TableCell>
          </TableRow>

          <TableRow v-if="expandedIds.has(row.id)" class="bg-muted/20 hover:bg-muted/20">
            <TableCell />
            <TableCell :colSpan="5">
              <p class="text-sm">{{ row.note }}</p>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <p class="text-muted-foreground mt-4 text-center text-sm">
      Expanding sub-row made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
