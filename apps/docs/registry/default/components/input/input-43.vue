<script setup lang="ts">
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Label } from '@/components/ui/label'
import { Group } from '@/components/ui/group'
import { DateInput } from '@/components/ui/date-input'
import { Button } from '@/components/ui/button'
import { Popover } from '@/components/ui/popover'
import { Dialog } from '@/components/ui/dialog'
import { RangeCalendar } from '@/components/ui/range-calendar'
</script>
<template>
<DateRangePicker
      class="*:not-first:mt-2"
    >
      <Label class="text-foreground text-sm font-medium">
        Date range picker (unavailable dates)
      </Label>
      <div class="flex">
        <Group>
          <DateInput slot="start" unstyled />
          <span aria-hidden="true" class="text-muted-foreground/70 px-2">
            -
          </span>
          <DateInput slot="end" unstyled />
        </Group>
        <Button class="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
        </Button>
      </div>
      <Popover
        class="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-md border shadow-lg outline-hidden" offset="4"
      >
        <Dialog class="max-h-[inherit] overflow-auto p-2">
          <RangeCalendar />
        </Dialog>
      </Popover>
      <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with 
        <a
          class="hover:text-foreground underline"
          href="https://react-spectrum.adobe.com/react-aria/DateRangePicker.html"
          target="_blank"
          rel="noopener nofollow"
        >
          React Aria
        </a>
      </p>
    </DateRangePicker>
</template>
