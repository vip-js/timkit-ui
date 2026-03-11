<script setup lang="ts">
import { BoltIcon, ChevronDownIcon, CopyPlusIcon, FilesIcon, Layers2Icon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';



</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline">Menu with icons
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem><CopyPlusIcon :size="16" class="opacity-60" aria-hidden="true" />Copy
        </DropdownMenuItem><DropdownMenuItem><BoltIcon :size="16" class="opacity-60" aria-hidden="true" />Edit
        </DropdownMenuItem><DropdownMenuItem><Layers2Icon :size="16" class="opacity-60" aria-hidden="true" />Group
        </DropdownMenuItem><DropdownMenuItem><FilesIcon :size="16" class="opacity-60" aria-hidden="true" />Clone
        </DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
