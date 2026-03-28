<script setup lang="ts">
import { Button } from '@timui/vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@timui/vue'
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover for details</Button>
      </TooltipTrigger>
      <TooltipContent>HTML adapter coverage is now explicit in CI reports.</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
