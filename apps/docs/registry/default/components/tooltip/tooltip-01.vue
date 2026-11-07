<script setup lang="ts">
import { ref } from 'vue'
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
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline" size="sm">Tiny
          </Button></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">This is a simple tooltip</TooltipContent></Tooltip></TooltipProvider>
</template>
