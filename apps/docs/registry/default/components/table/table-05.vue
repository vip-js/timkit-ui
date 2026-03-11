<script setup lang="ts">
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';



</script>

<template>
  <div><Table><TableHeader class="bg-transparent"><TableRow class="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead class="text-right">Balance</TableHead></TableRow></TableHeader><TableBody class="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg"><TableRow v-for="(item, index) in items" :key="index" :key="item.id" class="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"><TableCell class="font-medium">{{ item.name }}</TableCell><TableCell>{{ item.email }}</TableCell><TableCell>{{ item.location }}</TableCell><TableCell>{{ item.status }}</TableCell><TableCell class="text-right">{{ item.balance }}</TableCell></TableRow></TableBody></Table><p class="text-muted-foreground mt-4 text-center text-sm">Table with vertical lines</p></div>
</template>
