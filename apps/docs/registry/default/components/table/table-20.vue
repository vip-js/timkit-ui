<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, CircleAlertIcon, CircleXIcon, Columns3Icon, EllipsisIcon, FilterIcon, ListFilterIcon, PlusIcon, TrashIcon } from 'lucide-vue-next';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { AlertDialogAction } from '@/components/ui/alert-dialog-action';
import { AlertDialogCancel } from '@/components/ui/alert-dialog-cancel';
import { AlertDialogContent } from '@/components/ui/alert-dialog-content';
import { AlertDialogDescription } from '@/components/ui/alert-dialog-description';
import { AlertDialogFooter } from '@/components/ui/alert-dialog-footer';
import { AlertDialogHeader } from '@/components/ui/alert-dialog-header';
import { AlertDialogTitle } from '@/components/ui/alert-dialog-title';
import { AlertDialogTrigger } from '@/components/ui/alert-dialog-trigger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';



</script>

<template>
  <div class="space-y-4"><div class="flex flex-wrap items-center justify-between gap-3"><div class="flex items-center gap-3"><div class="relative"><Input :id="`${id}-input`" :ref="inputRef" :class="cn(
                'peer min-w-60 ps-9',
                Boolean(table.getColumn('name')?.getFilterValue()) && 'pe-9'
              )" :value="(table.getColumn('name')?.getFilterValue() ?? '') as string" :onChange="(e) => table.getColumn('name')?.setFilterValue(e.target.value)" placeholder="Filter by name or email..." type="text" aria-label="Filter by name or email" /><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"><ListFilterIcon :size="16" aria-hidden="true" /></div><button v-if="Boolean(table.getColumn('name')?.getFilterValue())" class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50" aria-label="Clear filter" @click="{
                  table.getColumn('name')?.setFilterValue('')
                  if (inputRef.current) {
                    inputRef.current.focus()
                  }
                }"><CircleXIcon :size="16" aria-hidden="true" /></button></div><Popover><PopoverTrigger as-child><Button variant="outline"><FilterIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Status
                <span v-if="selectedStatuses.length > 0" class="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">{{ selectedStatuses.length }}</span></Button></PopoverTrigger><PopoverContent class="w-auto min-w-36 p-3" align="start"><div class="space-y-3"><div class="text-muted-foreground text-xs font-medium">Filters</div><div class="space-y-3"><div v-for="(value, i) in uniqueStatusValues" :key="i" :key="value" class="flex items-center gap-2"><Checkbox :id="`${id}-${i}`" :checked="selectedStatuses.includes(value)" :onCheckedChange="(checked: boolean | 'indeterminate') =>
                          handleStatusChange(checked, value)" /><Label :htmlFor="`${id}-${i}`" class="flex grow justify-between gap-2 font-normal">{{ value }}{{ ' ' }}<span class="text-muted-foreground ms-2 text-xs">{{ statusCounts.get(value) }}</span></Label></div></div></div></PopoverContent></Popover><DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline"><Columns3Icon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />View
              </Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Toggle columns</DropdownMenuLabel>{{ table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value: boolean | 'indeterminate') =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event: SyntheticEvent) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                }) }}</DropdownMenuContent></DropdownMenu></div><div class="flex items-center gap-3"><AlertDialog v-if="table.getSelectedRowModel().rows.length > 0"><AlertDialogTrigger as-child><Button class="ml-auto" variant="outline"><TrashIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Delete
                  <span class="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">{{ table.getSelectedRowModel().rows.length }}</span></Button></AlertDialogTrigger><AlertDialogContent><div class="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4"><div class="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true"><CircleAlertIcon class="opacity-80" :size="16" /></div><AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete{{ ' ' }}{{ table.getSelectedRowModel().rows.length }}selected{{ ' ' }}{{ table.getSelectedRowModel().rows.length === 1 ? 'row' : 'rows' }}.
                    </AlertDialogDescription></AlertDialogHeader></div><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction @click="handleDeleteRows">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog><Button class="ml-auto" variant="outline"><PlusIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Add user
          </Button></div></div><div class="bg-background overflow-hidden rounded-md border"><Table class="table-fixed"><TableHeader><TableRow v-for="(headerGroup, index) in table.getHeaderGroups()" :key="index" :key="headerGroup.id" class="hover:bg-transparent">{{ headerGroup.headers.map((header) => {
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
                    <TableCell key={cell.id} className="last:py-0">
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
            ) }}</TableBody></Table></div><div class="flex items-center justify-between gap-8"><div class="flex items-center gap-3"><Label :htmlFor="id" class="max-sm:sr-only">Rows per page
          </Label><Select :value="table.getState().pagination.pageSize.toString()" @update:modelValue="{
              table.setPageSize(Number(value))
            }"><SelectTrigger :id="id" class="w-fit whitespace-nowrap"><SelectValue placeholder="Select number of results" /></SelectTrigger><SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2"><SelectItem v-for="(pageSize, index) in [5, 10, 25, 50]" :key="index" :key="pageSize" :value="pageSize.toString()">{{ pageSize }}</SelectItem></SelectContent></Select></div><div class="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap"><p class="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite"><span class="text-foreground">{{ table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 }}-
              {{ Math.min(
                Math.max(
                  table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              ) }}</span>{{ ' ' }}of <span class="text-foreground">{{ table.getRowCount().toString() }}</span></p></div><div><Pagination><PaginationContent><PaginationItem><Button size="icon" variant="outline" class="disabled:pointer-events-none disabled:opacity-50" @click="table.firstPage()" :disabled="!table.getCanPreviousPage()" aria-label="Go to first page"><ChevronFirstIcon :size="16" aria-hidden="true" /></Button></PaginationItem><PaginationItem><Button size="icon" variant="outline" class="disabled:pointer-events-none disabled:opacity-50" @click="table.previousPage()" :disabled="!table.getCanPreviousPage()" aria-label="Go to previous page"><ChevronLeftIcon :size="16" aria-hidden="true" /></Button></PaginationItem><PaginationItem><Button size="icon" variant="outline" class="disabled:pointer-events-none disabled:opacity-50" @click="table.nextPage()" :disabled="!table.getCanNextPage()" aria-label="Go to next page"><ChevronRightIcon :size="16" aria-hidden="true" /></Button></PaginationItem><PaginationItem><Button size="icon" variant="outline" class="disabled:pointer-events-none disabled:opacity-50" @click="table.lastPage()" :disabled="!table.getCanNextPage()" aria-label="Go to last page"><ChevronLastIcon :size="16" aria-hidden="true" /></Button></PaginationItem></PaginationContent></Pagination></div></div><p class="text-muted-foreground mt-4 text-center text-sm">Example of a more complex table made with{{ ' ' }}<a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">TanStack Table
        </a></p></div>
</template>
