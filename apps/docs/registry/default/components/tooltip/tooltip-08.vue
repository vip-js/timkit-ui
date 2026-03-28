<script setup lang="ts">
import { Button } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';




</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="sm">Stats
          </Button></TooltipTrigger><TooltipContent class="py-3"><ul class="grid gap-3 text-xs"><li class="grid gap-0.5"><span class="text-muted-foreground">Status</span><span class="font-medium">Completed</span></li><li class="grid gap-0.5"><span class="text-muted-foreground">Code Coverage</span><span class="font-medium">94.3%</span></li><li class="grid gap-0.5"><span class="text-muted-foreground">Last Deploy</span><span class="font-medium">Today at 15:42</span></li><li class="grid gap-0.5"><span class="text-muted-foreground">Performance Score</span><span class="font-medium">98/100</span></li></ul></TooltipContent></Tooltip></TooltipProvider>
</template>
