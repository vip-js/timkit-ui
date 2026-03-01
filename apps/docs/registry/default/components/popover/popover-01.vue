<script setup lang="ts">
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Filters">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-36 p-3">
          <div class="space-y-3">
            <div class="text-muted-foreground text-xs font-medium">Filters</div>
            <form>
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <Checkbox id="popover-01-id" />
                  <Label for="popover-01-id" class="font-normal">
                    Real Time
                  </Label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox id="popover-01-id" />
                  <Label for="popover-01-id" class="font-normal">
                    Top Channels
                  </Label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox id="popover-01-id" />
                  <Label for="popover-01-id" class="font-normal">
                    Last Orders
                  </Label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox id="popover-01-id" />
                  <Label for="popover-01-id" class="font-normal">
                    Total Spent
                  </Label>
                </div>
              </div>
              <div
                role="separator"
                aria-orientation="horizontal"
                class="bg-border -mx-3 my-3 h-px"
              ></div>
              <div class="flex justify-between gap-2">
                <Button size="sm" variant="outline" class="h-7 px-2">
                  Clear
                </Button>
                <Button size="sm" class="h-7 px-2">
                  Apply
                </Button>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
</template>
