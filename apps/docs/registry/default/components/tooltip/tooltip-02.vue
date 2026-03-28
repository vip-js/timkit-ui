<script setup lang="ts">
import { Button } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';




</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="sm">Dark
          </Button></TooltipTrigger><TooltipContent class="dark px-2 py-1 text-xs">This tooltip will be always dark
        </TooltipContent></Tooltip></TooltipProvider>
</template>
