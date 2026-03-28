<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue'
import { Calendar } from '@timui/vue'
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns'

type CalendarRangeValue = { from?: Date; to?: Date } | undefined

const today = new Date()
const yesterday = { from: subDays(today, 1), to: subDays(today, 1) }
const last7Days = { from: subDays(today, 6), to: today }
const last30Days = { from: subDays(today, 29), to: today }
const monthToDate = { from: startOfMonth(today), to: today }
const lastMonthDate = subMonths(today, 1)
const lastMonth = { from: startOfMonth(lastMonthDate), to: endOfMonth(lastMonthDate) }
const yearToDate = { from: startOfYear(today), to: today }
const lastYearDate = subYears(today, 1)
const lastYear = { from: startOfYear(lastYearDate), to: endOfYear(lastYearDate) }

const month = ref<Date>(today)
const date = ref<CalendarRangeValue>(last7Days)

const setDate = (next: CalendarRangeValue) => {
  date.value = next
}

const setMonth = (next: Date) => {
  month.value = next
}

const applyRange = (range: Exclude<CalendarRangeValue, undefined>) => {
  setDate(range)
  if (range.to) setMonth(range.to)
}

const onCalendarChange = (newDate?: Date | Date[] | CalendarRangeValue) => {
  if (!newDate || Array.isArray(newDate) || newDate instanceof Date) return
  setDate(newDate)
}
</script>

<template>
  <div>
    <div class="rounded-md border">
      <div class="flex max-sm:flex-col">
        <div class="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
          <div class="h-full sm:border-e">
            <div class="flex flex-col px-2">
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyRange({ from: today, to: today })">Today</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyRange(yesterday)">Yesterday</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyRange(last7Days)">Last 7 days</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyRange(last30Days)">Last 30 days</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyRange(monthToDate)">Month to date</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyRange(lastMonth)">Last month</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyRange(yearToDate)">Year to date</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyRange(lastYear)">Last year</Button>
            </div>
          </div>
        </div>
        <Calendar
          mode="range"
          class="p-2"
          :selected="date"
          :month="month"
          :onMonthChange="setMonth"
          :disabled="[{ after: today }]"
          @update:modelValue="onCalendarChange"
        />
      </div>
    </div>
    <p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">
      Range calendar with presets -
      <a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">
        React DayPicker
      </a>
    </p>
  </div>
</template>
