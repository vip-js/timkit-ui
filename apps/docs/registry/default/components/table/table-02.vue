<script setup lang="ts">
import { Table } from '@/components/ui/table';
import { TableBody } from '@/components/ui/table-body';
import { TableCell } from '@/components/ui/table-cell';
import { TableHead } from '@/components/ui/table-head';
import { TableHeader } from '@/components/ui/table-header';
import { TableRow } from '@/components/ui/table-row';



</script>

<template>
  <div><Table><TableHeader><TableRow class="hover:bg-transparent"><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead class="text-right">Balance</TableHead></TableRow></TableHeader><TableBody><TableRow v-for="(item, index) in items" :key="index" :key="item.id"><TableCell><div class="flex items-center gap-3"><img class="rounded-full" :src="item.image" :width="40" :height="40" :alt="item.name" /><div><div class="font-medium">{{ item.name }}</div><span class="text-muted-foreground mt-0.5 text-xs">{{ item.username }}</span></div></div></TableCell><TableCell>{{ item.email }}</TableCell><TableCell>{{ item.location }}</TableCell><TableCell>{{ item.status }}</TableCell><TableCell class="text-right">{{ item.balance }}</TableCell></TableRow></TableBody></Table><p class="text-muted-foreground mt-4 text-center text-sm">Table with images</p></div>
</template>
