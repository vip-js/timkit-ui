<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
</script>
<template>
<Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Tooltip-like with nav</Button>
      </PopoverTrigger>
      <PopoverContent class="max-w-[280px] py-3 shadow-none" side="top">
        <div class="space-y-3">
          <div class="space-y-1">
            <p class="text-[13px] font-medium"></p>
            <p class="text-muted-foreground text-xs"></p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs">
              /
            </span>
            <div class="flex gap-0.5">
              <Button
                size="icon"
                variant="ghost"
                class="size-6"
                aria-label="Previous tip"
              >
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                class="size-6"
                aria-label="Next tip"
              >
                 <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
</template>
