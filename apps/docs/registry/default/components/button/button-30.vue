<script setup lang="ts">
import { ref } from 'vue';
import { cn } from '@timui/core';
import { CheckIcon, CopyIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';



const copied = ref<boolean>(false);

</script>

<template>
  <TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button variant="outline" size="icon" class="disabled:opacity-100" @click="handleCopy" :aria-label="copied ? 'Copied' : 'Copy to clipboard'" :disabled="copied"><div :class="cn(
                'transition-all',
                copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              )"><CheckIcon class="stroke-emerald-500" :size="16" aria-hidden="true" /></div><div :class="cn(
                'absolute transition-all',
                copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
              )"><CopyIcon :size="16" aria-hidden="true" /></div></Button></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Click to copy</TooltipContent></Tooltip></TooltipProvider>
</template>
