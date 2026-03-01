<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-54-id">Copy to clipboard</Label>
      <div class="relative">
        <Input id="input-54-id"
          class="pe-9"
          type="text"
          defaultValue="pnpm install origin-ui"
          readOnly
        />
        <TooltipProvider delayDuration="0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                aria-label='Copy to clipboard'
              >
                <div
                >
                   <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stroke-emerald-500"><circle cx="12" cy="12" r="9" /></svg>
                </div>
                <div
                >
                   <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent class="px-2 py-1 text-xs">Copy to clipboard</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
</template>
