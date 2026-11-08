<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline" size="icon" aria-label="Add new item"><PlusIcon :size="16" aria-hidden="true" /></Button></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Tooltip</TooltipContent></Tooltip></TooltipProvider>
</template>
