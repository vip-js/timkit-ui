<script setup lang="ts">
import { GlobeIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';



</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="sm">W/ icon
          </Button></TooltipTrigger><TooltipContent class="dark py-3"><div class="flex gap-3"><GlobeIcon class="mt-0.5 shrink-0 opacity-60" :size="16" aria-hidden="true" /><div class="space-y-1"><p class="text-[13px] font-medium">Tooltip with title and icon</p><p class="text-muted-foreground text-xs">Tooltips are made to be highly customizable, with features like dynamic placement,
                rich content, and a robust API.
              </p></div></div></TooltipContent></Tooltip></TooltipProvider>
</template>
