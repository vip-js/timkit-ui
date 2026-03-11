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
  <div><div class="[&>div]:max-h-96"><Table class="[&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b"><TableHeader class="bg-background/90 sticky top-0 z-10 backdrop-blur-xs"><TableRow class="hover:bg-transparent"><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead class="text-right">Balance</TableHead></TableRow></TableHeader><TableBody><TableRow v-for="(item, index) in items" :key="index" :key="item.id"><TableCell class="font-medium">{{ item.name }}</TableCell><TableCell>{{ item.email }}</TableCell><TableCell>{{ item.location }}</TableCell><TableCell>{{ item.status }}</TableCell><TableCell class="text-right">{{ item.balance }}</TableCell></TableRow></TableBody><TableFooter class="bg-transparent"><TableRow class="hover:bg-transparent"><TableCell :colSpan="4">Total</TableCell><TableCell class="text-right">$2,500.00</TableCell></TableRow></TableFooter></Table></div><p class="text-muted-foreground mt-8 text-center text-sm">Table with sticky header</p></div>
</template>
