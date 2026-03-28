<script setup lang="ts">
import { GlobeIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';




</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="sm">W/ icon
          </Button></TooltipTrigger><TooltipContent class="dark py-3"><div class="flex gap-3"><GlobeIcon class="mt-0.5 shrink-0 opacity-60" :size="16" aria-hidden="true" /><div class="space-y-1"><p class="text-[13px] font-medium">Tooltip with title and icon</p><p class="text-muted-foreground text-xs">Tooltips are made to be highly customizable, with features like dynamic placement,
                rich content, and a robust API.
              </p></div></div></TooltipContent></Tooltip></TooltipProvider>
</template>
