<script setup lang="ts">
import { Button } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';




</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="sm">W/ title
          </Button></TooltipTrigger><TooltipContent class="py-3"><div class="space-y-1"><p class="text-[13px] font-medium">Tooltip with title</p><p class="text-muted-foreground text-xs">Tooltips are made to be highly customizable, with features like dynamic placement,
              rich content, and a robust API. You can even use them as a full-featured dropdown menu
              by setting the <code>trigger</code>prop to <code>click</code>.
            </p></div></TooltipContent></Tooltip></TooltipProvider>
</template>
