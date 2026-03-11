<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';
import { usePagination } from '@/registry/default/hooks/use-pagination.vue';


</script>

<template>
  <div class="space-y-4"><div class="bg-background overflow-hidden rounded-md border"><Table class="table-fixed"><TableHeader><TableRow v-for="(headerGroup, index) in table.getHeaderGroups()" :key="index" :key="headerGroup.id" class="hover:bg-transparent">{{ headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                }) }}</TableRow></TableHeader><TableBody>{{ table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) }}</TableBody></Table></div><div class="flex items-center justify-between gap-3 max-sm:flex-col"><p class="text-muted-foreground flex-1 text-sm whitespace-nowrap" aria-live="polite">Page <span class="text-foreground">{{ table.getState().pagination.pageIndex + 1 }}</span>{{ ' ' }}of <span class="text-foreground">{{ table.getPageCount() }}</span></p><div class="grow"><Pagination><PaginationContent><PaginationItem><Button size="icon" variant="outline" class="disabled:pointer-events-none disabled:opacity-50" @click="table.previousPage()" :disabled="!table.getCanPreviousPage()" aria-label="Go to previous page"><ChevronLeftIcon :size="16" aria-hidden="true" /></Button></PaginationItem><PaginationItem v-if="showLeftEllipsis"><PaginationEllipsis /></PaginationItem>{{ pages.map((page) => {
                const isActive = page === table.getState().pagination.pageIndex + 1
                return (
                  <PaginationItem key={page}>
                    <Button
                      size="icon"
                      variant={`${isActive ? 'outline' : 'ghost'}`}
                      onClick={() => table.setPageIndex(page - 1)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                )
              }) }}<PaginationItem v-if="showRightEllipsis"><PaginationEllipsis /></PaginationItem><PaginationItem><Button size="icon" variant="outline" class="disabled:pointer-events-none disabled:opacity-50" @click="table.nextPage()" :disabled="!table.getCanNextPage()" aria-label="Go to next page"><ChevronRightIcon :size="16" aria-hidden="true" /></Button></PaginationItem></PaginationContent></Pagination></div><div class="flex flex-1 justify-end"><Select :value="table.getState().pagination.pageSize.toString()" @update:modelValue="{
              table.setPageSize(Number(value))
            }" aria-label="Results per page"><SelectTrigger id="results-per-page" class="w-fit whitespace-nowrap"><SelectValue placeholder="Select number of results" /></SelectTrigger><SelectContent><SelectItem v-for="(pageSize, index) in [5, 10, 25, 50]" :key="index" :key="pageSize" :value="pageSize.toString()">{{ pageSize }}/ page
                </SelectItem></SelectContent></Select></div></div><p class="text-muted-foreground mt-4 text-center text-sm">Numeric pagination made with{{ ' ' }}<a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">TanStack Table
        </a></p></div>
</template>
