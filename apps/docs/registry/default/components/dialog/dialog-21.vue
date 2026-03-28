<script setup lang="ts">
import { ref } from 'vue';
import { ArrowUpRightIcon, CircleFadingPlusIcon, FileInputIcon, FolderPlusIcon, SearchIcon } from 'lucide-vue-next';
import { CommandDialog } from '@timui/vue';
import { CommandEmpty } from '@timui/vue';
import { CommandGroup } from '@timui/vue';
import { CommandInput } from '@timui/vue';
import { CommandItem } from '@timui/vue';
import { CommandList } from '@timui/vue';
import { CommandSeparator } from '@timui/vue';
import { CommandShortcut } from '@timui/vue';



const open = ref(false);


function setOpen(next: typeof open.value | ((prev: typeof open.value) => typeof open.value)) {
  open.value = typeof next === 'function'
    ? (next as (prev: typeof open.value) => typeof open.value)(open.value)
    : next;
}

</script>

<template>
  <button class="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9 w-fit rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]" @click="setOpen(true)"><span class="flex grow items-center"><SearchIcon class="text-muted-foreground/80 -ms-1 me-3" :size="16" aria-hidden="true" /><span class="text-muted-foreground/70 font-normal">Search</span></span><kbd class="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">⌘K
        </kbd></button><CommandDialog :open="open" @update:open="setOpen"><CommandInput placeholder="Type a command or search..." /><CommandList><CommandEmpty>No results found.</CommandEmpty><CommandGroup heading="Quick start"><CommandItem><FolderPlusIcon :size="16" class="opacity-60" aria-hidden="true" /><span>New folder</span><CommandShortcut class="justify-center">⌘N</CommandShortcut></CommandItem><CommandItem><FileInputIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Import document</span><CommandShortcut class="justify-center">⌘I</CommandShortcut></CommandItem><CommandItem><CircleFadingPlusIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Add block</span><CommandShortcut class="justify-center">⌘B</CommandShortcut></CommandItem></CommandGroup><CommandSeparator /><CommandGroup heading="Navigation"><CommandItem><ArrowUpRightIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Go to dashboard</span></CommandItem><CommandItem><ArrowUpRightIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Go to apps</span></CommandItem><CommandItem><ArrowUpRightIcon :size="16" class="opacity-60" aria-hidden="true" /><span>Go to connections</span></CommandItem></CommandGroup></CommandList></CommandDialog>
</template>
