<script setup lang="ts">
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
  <div><Table><TableHeader><TableRow class="hover:bg-transparent"><TableHead><Checkbox :checked="allSelected || (someSelected && 'indeterminate')" :onCheckedChange="(value) => {
                  const checked = toChecked(value)
                  setSelectedRows(Object.fromEntries(items.map((item) => [item.id, checked])))
                }" @click="{
                  const next = !allSelected
                  setSelectedRows(Object.fromEntries(items.map((item) => [item.id, next])))
                }" aria-label="Select all rows" /></TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead class="text-right">Balance</TableHead></TableRow></TableHeader><TableBody><TableRow v-for="(item, index) in items" :key="index" :key="item.id" :data-state="selectedRows[item.id] ? 'selected' : undefined" class="has-data-[state=checked]:bg-muted/50"><TableCell><Checkbox :id="`table-checkbox-${item.id}`" :checked="!!selectedRows[item.id]" :onCheckedChange="(value) => {
                    const checked = toChecked(value)
                    setSelectedRows((prev) => ({ ...prev, [item.id]: checked }))
                  }" @click="{
                    setSelectedRows((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }" :aria-label="`Select ${item.name}`" /></TableCell><TableCell class="font-medium">{{ item.name }}</TableCell><TableCell>{{ item.email }}</TableCell><TableCell>{{ item.location }}</TableCell><TableCell>{{ item.status }}</TableCell><TableCell class="text-right">{{ item.balance }}</TableCell></TableRow></TableBody><TableFooter class="bg-transparent"><TableRow class="hover:bg-transparent"><TableCell :colSpan="5">Total</TableCell><TableCell class="text-right">$2,500.00</TableCell></TableRow></TableFooter></Table><p class="text-muted-foreground mt-4 text-center text-sm">Table with row selection</p></div>
</template>
