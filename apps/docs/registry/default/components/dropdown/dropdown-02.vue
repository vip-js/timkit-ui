<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline">Same width of trigger
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent class="min-w-(--radix-dropdown-menu-trigger-width)"><DropdownMenuItem>Option 1</DropdownMenuItem><DropdownMenuItem>Option 2</DropdownMenuItem><DropdownMenuItem>Option 3</DropdownMenuItem><DropdownMenuItem>Option 4</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
