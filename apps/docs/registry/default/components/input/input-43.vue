<script setup lang="ts">
import { computed, ref } from 'vue'
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

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return startOfDay(next)
}

const now = startOfDay(new Date())
const disabledRanges: Array<[Date, Date]> = [
  [now, addDays(now, 5)],
  [addDays(now, 14), addDays(now, 16)],
  [addDays(now, 23), addDays(now, 24)],
]

const rangeValue = ref<{ from?: Date; to?: Date } | undefined>(undefined)

function isDateUnavailable(date: Date) {
  const target = startOfDay(date).getTime()
  const day = date.getDay()
  const isWeekend = day === 0 || day === 6
  return (
    isWeekend ||
    disabledRanges.some(
      ([start, end]) => target >= start.getTime() && target <= end.getTime()
    )
  )
}

function setRange(next: Date | { from?: Date; to?: Date } | undefined) {
  rangeValue.value = next && !(next instanceof Date) ? next : undefined
}

const validationMessage = computed(() => {
  const value = rangeValue.value
  if (!value?.from || !value?.to) return null

  const start = startOfDay(value.from).getTime()
  const end = startOfDay(value.to).getTime()

  const hasUnavailable = disabledRanges.some(
    ([rangeStart, rangeEnd]) =>
      end >= rangeStart.getTime() && start <= rangeEnd.getTime()
  )

  return hasUnavailable ? 'Selected date range may not include unavailable dates.' : null
})
</script>

<template>
  <DateRangePicker
    class="*:not-first:mt-2"
    :modelValue="rangeValue"
    :isDateUnavailable="isDateUnavailable"
    :minDate="now"
    @update:modelValue="setRange"
  >
    <Label class="text-foreground text-sm font-medium">Date range picker (unavailable dates)</Label>

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

    <p v-if="validationMessage" class="text-destructive mt-1 text-xs" role="alert">
      {{ validationMessage }}
    </p>

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
