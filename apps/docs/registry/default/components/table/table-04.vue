<script setup lang="ts">
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableFooter } from '@/components/ui/table-footer';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';



</script>

<template>
  <div><Table><TableHeader class="bg-transparent"><TableRow class="hover:bg-transparent"><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead class="text-right">Balance</TableHead></TableRow></TableHeader><tbody aria-hidden="true" class="table-row h-2"></tbody><TableBody class="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg"><TableRow v-for="(item, index) in items" :key="index" :key="item.id" class="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"><TableCell class="py-2.5 font-medium">{{ item.name }}</TableCell><TableCell class="py-2.5">{{ item.email }}</TableCell><TableCell class="py-2.5">{{ item.location }}</TableCell><TableCell class="py-2.5">{{ item.status }}</TableCell><TableCell class="py-2.5 text-right">{{ item.balance }}</TableCell></TableRow></TableBody><tbody aria-hidden="true" class="table-row h-2"></tbody><TableFooter class="bg-transparent"><TableRow class="hover:bg-transparent"><TableCell :colSpan="4">Total</TableCell><TableCell class="text-right">$2,500.00</TableCell></TableRow></TableFooter></Table><p class="text-muted-foreground mt-4 text-center text-sm">Striped table</p></div>
</template>
