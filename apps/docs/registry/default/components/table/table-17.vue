<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';



</script>

<template>
  <div><Table><TableHeader><TableRow v-for="(headerGroup, index) in table.getHeaderGroups()" :key="index" :key="headerGroup.id" class="hover:bg-transparent">{{ headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              }) }}</TableRow></TableHeader><TableBody>{{ table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap [&:has([aria-expanded])]:w-px [&:has([aria-expanded])]:py-0 [&:has([aria-expanded])]:pr-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length}>
                      <div className="text-primary/80 flex items-start py-2">
                        <span
                          className="me-3 mt-0.5 flex w-7 shrink-0 justify-center"
                          aria-hidden="true"
                        >
                          <InfoIcon className="opacity-60" size={16} />
                        </span>
                        <p className="text-sm">{row.original.note}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) }}</TableBody></Table><p class="text-muted-foreground mt-4 text-center text-sm">Expanding sub-row made with{{ ' ' }}<a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">TanStack Table
        </a></p></div>
</template>
