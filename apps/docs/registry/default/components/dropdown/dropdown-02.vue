<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <DropdownMenu><DropdownMenuTrigger as-child><Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline">Same width of trigger
          <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent class="min-w-(--radix-dropdown-menu-trigger-width)"><DropdownMenuItem>Option 1</DropdownMenuItem><DropdownMenuItem>Option 2</DropdownMenuItem><DropdownMenuItem>Option 3</DropdownMenuItem><DropdownMenuItem>Option 4</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
</template>
