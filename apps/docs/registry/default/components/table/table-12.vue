<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableFooter } from '@/components/ui/table-footer';
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
          ) }}</TableBody><TableFooter class="bg-transparent"><TableRow class="hover:bg-transparent"><TableCell :colSpan="5">Total</TableCell><TableCell class="text-right">{{ new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(data.reduce((total, item) => total + item.balance, 0)) }}</TableCell></TableRow></TableFooter></Table><p class="text-muted-foreground mt-4 text-center text-sm">Basic data table made with{{ ' ' }}<a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">TanStack Table
        </a></p></div>
</template>
