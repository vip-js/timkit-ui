<script setup lang="ts">
import { EllipsisIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button size="icon" variant="ghost" class="rounded-full shadow-none" aria-label="Open edit menu"><EllipsisIcon :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Option 1</DropdownMenuItem><DropdownMenuItem>Option 2</DropdownMenuItem><DropdownMenuItem>Option 3</DropdownMenuItem><DropdownMenuItem>Option 4</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
