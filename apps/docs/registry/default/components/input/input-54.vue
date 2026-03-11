<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CheckIcon, CopyIcon } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';



</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Copy to clipboard</Label><div class="relative"><Input :ref="inputRef" :id="id" class="pe-9" type="text" default-value="pnpm install origin-ui" readOnly /><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><button @click="handleCopy" class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed" :aria-label="copied ? 'Copied' : 'Copy to clipboard'" :disabled="copied"><div :class="cn(
                    'transition-all',
                    copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  )"><CheckIcon class="stroke-emerald-500" :size="16" aria-hidden="true" /></div><div :class="cn(
                    'absolute transition-all',
                    copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                  )"><CopyIcon :size="16" aria-hidden="true" /></div></button></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Copy to clipboard</TooltipContent></Tooltip></TooltipProvider></div></div>
</template>
