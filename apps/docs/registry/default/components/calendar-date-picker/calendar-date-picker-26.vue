<script setup lang="ts">
import { cn } from '@timui/core'
import { CalendarIcon } from 'lucide-vue-next'
import { DateInput } from '@timui/vue'
import { DateRangePicker } from '@timui/vue'
import { DateRangePickerContent } from '@timui/vue'
import { DateRangePickerTrigger } from '@timui/vue'
import { Group } from '@timui/vue'
import { Label } from '@timui/vue'
import { RangeCalendar } from '@timui/vue'

const dateInputStyle =
  'relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:ring-[3px] data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive'
</script>

<template>
  <DateRangePicker class="*:not-first:mt-2">
    <Label class="text-foreground text-sm font-medium">Date range picker</Label>

    <div class="flex">
      <Group :class="cn(dateInputStyle, 'pe-9')">
        <DateInput data-slot="start" unstyled />
        <span aria-hidden="true" class="text-muted-foreground/70 px-2">-</span>
        <DateInput data-slot="end" unstyled />
      </Group>

      <DateRangePickerTrigger
        class="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]"
      >
        <CalendarIcon :size="16" />
      </DateRangePickerTrigger>
    </div>

    <DateRangePickerContent
      class="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-md border shadow-lg outline-hidden"
    >
      <div class="max-h-[inherit] overflow-auto p-2">
        <RangeCalendar />
      </div>
    </DateRangePickerContent>

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
