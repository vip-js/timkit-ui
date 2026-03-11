<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';



</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="icon" aria-label="Add new item"><PlusIcon :size="16" aria-hidden="true" /></Button></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Tooltip</TooltipContent></Tooltip></TooltipProvider>
</template>
