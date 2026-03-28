<script setup lang="ts">
import { BoltIcon, BookOpenIcon, CircleUserRoundIcon, Layers2Icon, LogOutIcon, PinIcon, UserPenIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@timui/vue';




</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button size="icon" variant="outline" aria-label="Open account menu"><CircleUserRoundIcon :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent class="max-w-64"><DropdownMenuLabel class="flex items-start gap-3"><img src="avatar.jpg" alt="Avatar" :width="32" :height="32" class="shrink-0 rounded-full" /><div class="flex min-w-0 flex-col"><span class="text-foreground truncate text-sm font-medium">Keith Kennedy</span><span class="text-muted-foreground truncate text-xs font-normal">k.kennedy@ui.timkit.cn
            </span></div></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuGroup><DropdownMenuItem><BoltIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Option 1</span></DropdownMenuItem><DropdownMenuItem><Layers2Icon :size="16" class="opacity-60" aria-hidden="true" /><span>Option 2</span></DropdownMenuItem><DropdownMenuItem><BookOpenIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Option 3</span></DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuGroup><DropdownMenuItem><PinIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Option 4</span></DropdownMenuItem><DropdownMenuItem><UserPenIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Option 5</span></DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuItem><LogOutIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Logout</span></DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
