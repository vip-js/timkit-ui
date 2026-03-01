<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
</script>
<template>
<DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Same width of trigger
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-me-1 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
        <DropdownMenuItem>Option 3</DropdownMenuItem>
        <DropdownMenuItem>Option 4</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
</template>
