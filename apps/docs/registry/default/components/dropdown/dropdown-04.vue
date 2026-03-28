<script setup lang="ts">
import { BoltIcon, ChevronDownIcon, CopyPlusIcon, FilesIcon, Layers2Icon, TrashIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@timui/vue';




</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button variant="outline">Grouped items
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuGroup><DropdownMenuItem><CopyPlusIcon :size="16" class="opacity-60" aria-hidden="true" />Copy
          </DropdownMenuItem><DropdownMenuItem><BoltIcon :size="16" class="opacity-60" aria-hidden="true" />Edit
          </DropdownMenuItem></DropdownMenuGroup><DropdownMenuSeparator /><DropdownMenuGroup><DropdownMenuItem><Layers2Icon :size="16" class="opacity-60" aria-hidden="true" />Group
          </DropdownMenuItem><DropdownMenuItem><FilesIcon :size="16" class="opacity-60" aria-hidden="true" />Clone
          </DropdownMenuItem><DropdownMenuItem variant="destructive"><TrashIcon :size="16" aria-hidden="true" />Delete
          </DropdownMenuItem></DropdownMenuGroup></DropdownMenuContent></DropdownMenu>
</template>
