<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';



</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="sm">W/ arrow
          </Button></TooltipTrigger><TooltipContent class="dark px-2 py-1 text-xs" :showArrow="true">This tooltip has an arrow
        </TooltipContent></Tooltip></TooltipProvider>
</template>
