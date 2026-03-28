<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
import { Button } from '@timui/vue'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@timui/vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue'
import { Table } from '@timui/vue'
import { TableBody } from '@timui/vue'
import { TableCell } from '@timui/vue'
import { TableHead } from '@timui/vue'
import { TableHeader } from '@timui/vue'
import { TableRow } from '@timui/vue'
import { usePagination } from '@/registry/default/hooks/use-pagination'
import { formatCurrency, tableUsers } from './table-demo-data'

const pageIndex = ref(0)
const pageSize = ref(5)

const pageCount = computed(() => Math.max(1, Math.ceil(tableUsers.length / pageSize.value)))

const pagedRows = computed(() => {
  const start = pageIndex.value * pageSize.value
  return tableUsers.slice(start, start + pageSize.value)
})

const pager = computed(() =>
  usePagination({
    currentPage: pageIndex.value + 1,
    totalPages: pageCount.value,
    paginationItemsToDisplay: 5,
  })
)

function previousPage() {
  pageIndex.value = Math.max(0, pageIndex.value - 1)
}

function nextPage() {
  pageIndex.value = Math.min(pageCount.value - 1, pageIndex.value + 1)
}

function setPage(page: number) {
  pageIndex.value = page - 1
}

function changePageSize(value: string) {
  pageSize.value = Number(value)
  pageIndex.value = 0
}
</script>

<template>
  <div class="space-y-4">
    <div class="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Balance</TableHead>
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

    <div class="flex items-center justify-between gap-3 max-sm:flex-col">
      <p class="text-muted-foreground flex-1 text-sm whitespace-nowrap" aria-live="polite">
        Page <span class="text-foreground">{{ pageIndex + 1 }}</span> of <span class="text-foreground">{{ pageCount }}</span>
      </p>

      <div class="grow">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                class="disabled:pointer-events-none disabled:opacity-50"
                :disabled="pageIndex === 0"
                aria-label="Go to previous page"
                @click="previousPage"
              >
                <ChevronLeftIcon :size="16" aria-hidden="true" />
              </Button>
            </PaginationItem>

            <PaginationItem v-if="pager.showLeftEllipsis">
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem v-for="page in pager.pages" :key="page">
              <Button
                size="icon"
                :variant="page === pageIndex + 1 ? 'outline' : 'ghost'"
                :aria-current="page === pageIndex + 1 ? 'page' : undefined"
                @click="setPage(page)"
              >
                {{ page }}
              </Button>
            </PaginationItem>

            <PaginationItem v-if="pager.showRightEllipsis">
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <Button
                size="icon"
                variant="outline"
                class="disabled:pointer-events-none disabled:opacity-50"
                :disabled="pageIndex >= pageCount - 1"
                aria-label="Go to next page"
                @click="nextPage"
              >
                <ChevronRightIcon :size="16" aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div class="flex flex-1 justify-end">
        <Select :value="String(pageSize)" @update:modelValue="changePageSize" aria-label="Results per page">
          <SelectTrigger class="w-fit whitespace-nowrap">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 / page</SelectItem>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <p class="text-muted-foreground mt-4 text-center text-sm">
      Numeric pagination made with
      <a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">
        TanStack Table
      </a>
    </p>
  </div>
</template>
