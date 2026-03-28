<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';




</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="icon" aria-label="Add new item"><PlusIcon :size="16" aria-hidden="true" /></Button></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Tooltip</TooltipContent></Tooltip></TooltipProvider>
</template>
