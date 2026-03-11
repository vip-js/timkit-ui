<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';



</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="sm">W/ image
          </Button></TooltipTrigger><TooltipContent class="py-3"><div class="space-y-2"><img class="w-full rounded" src="/dialog-content.png" :width="382" :height="216" alt="Content image" /><div class="space-y-1"><p class="text-[13px] font-medium">Tooltip with title and icon</p><p class="text-muted-foreground text-xs">Tooltips are made to be highly customizable, with features like dynamic placement,
                rich content, and a robust API.
              </p></div></div></TooltipContent></Tooltip></TooltipProvider>
</template>
