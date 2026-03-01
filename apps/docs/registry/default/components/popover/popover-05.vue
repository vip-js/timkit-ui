<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
</script>
<template>
<Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Tooltip-like with steps</Button>
      </PopoverTrigger>
      <PopoverContent class="max-w-[280px] py-3 shadow-none" side="top">
        <div class="space-y-3">
          <div class="space-y-1">
            <p class="text-[13px] font-medium"></p>
            <p class="text-muted-foreground text-xs"></p>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-muted-foreground text-xs">
              /
            </span>
            <button class="text-xs font-medium hover:underline" >
              'Next'
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
</template>
