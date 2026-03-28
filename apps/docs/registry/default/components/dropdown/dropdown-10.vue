<script setup lang="ts">
import { CircleUserRoundIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@timui/vue';




</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button size="icon" variant="outline" aria-label="Open account menu"><CircleUserRoundIcon :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent class="max-w-64"><DropdownMenuLabel class="flex flex-col"><span>Signed in as</span><span class="text-foreground text-xs font-normal">k.kennedy@ui.timkit.cn</span></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuGroup><DropdownMenuItem>Option 1</DropdownMenuItem><DropdownMenuItem>Option 2</DropdownMenuItem><DropdownMenuItem>Option 3</DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuItem>Logout</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
