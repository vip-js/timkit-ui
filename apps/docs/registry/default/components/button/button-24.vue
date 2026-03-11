<script setup lang="ts">
import { BookmarkIcon } from 'lucide-vue-next';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';



</script>

<template>
  <TooltipProvider><Tooltip><TooltipTrigger as-child><div><Toggle class="group size-9 p-0 hover:bg-indigo-50 hover:text-indigo-500 data-[state=on]:bg-indigo-50 data-[state=on]:text-indigo-500" aria-label="BookmarkIcon this" :pressed="bookmarked" :onPressedChange="setBookmarked"><BookmarkIcon :size="16" aria-hidden="true" /></Toggle></div></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs"><p>{{ bookmarked ? 'Remove bookmark' : 'BookmarkIcon this' }}</p></TooltipContent></Tooltip></TooltipProvider>
</template>
