<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';



</script>

<template>
  <DndContext :id="useId()" :collisionDetection="closestCenter" :modifiers="[restrictToHorizontalAxis]" :onDragEnd="handleDragEnd" :sensors="sensors"><Table><TableHeader><TableRow v-for="(headerGroup, index) in table.getHeaderGroups()" :key="index" :key="headerGroup.id" class="bg-muted/50"><SortableContext :items="columnOrder" :strategy="horizontalListSortingStrategy"><DraggableTableHeader v-for="(header, index) in headerGroup.headers" :key="index" :key="header.id" :header="header" /></SortableContext></TableRow></TableHeader><TableBody>{{ table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <SortableContext
                    key={cell.id}
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    <DragAlongCell key={cell.id} cell={cell} />
                  </SortableContext>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) }}</TableBody></Table><p class="text-muted-foreground mt-4 text-center text-sm">Draggable columns made with{{ ' ' }}<a class="hover:text-foreground underline" href="https://tanstack.com/table" target="_blank" rel="noopener noreferrer">TanStack Table
        </a>{{ ' ' }}and{{ ' ' }}<a href="https://dndkit.com/" target="_blank" rel="noopener noreferrer">dnd kit
        </a></p></DndContext>
</template>
