<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@timui/vue'

const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline">Hover for details</Button>
      </TooltipTrigger>
      <TooltipContent>HTML adapter coverage is now explicit in CI reports.</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
