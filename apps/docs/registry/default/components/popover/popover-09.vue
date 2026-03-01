<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
</script>
<template>
<div class="flex flex-col gap-4">
      <Popover >
        <div class="grid grid-cols-2 place-items-center gap-4">
          
        </div>

        <PopoverTrigger asChild>
          <Button variant="outline">Start tour</Button>
        </PopoverTrigger>

        <PopoverContent
          class="max-w-[280px] py-3 shadow-none"
          side='right' showArrow
        >
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
    </div>
</template>
