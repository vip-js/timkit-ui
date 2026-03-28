<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue'
import { Calendar } from '@timui/vue'
import { subDays, subMonths, subYears } from 'date-fns'

const today = new Date()
const yesterday = subDays(today, 1)
const lastWeek = subDays(today, 7)
const lastMonth = subMonths(today, 1)
const lastYear = subYears(today, 1)

const month = ref<Date>(today)
const date = ref<Date | undefined>(today)

const setDate = (next?: Date) => {
  date.value = next
}

const setMonth = (next: Date) => {
  month.value = next
}

const applyPreset = (presetDate: Date) => {
  setDate(presetDate)
  setMonth(presetDate)
}

const onCalendarChange = (newDate?: Date) => {
  if (!newDate) return
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
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyPreset(today)">Today</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyPreset(yesterday)">Yesterday</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyPreset(lastWeek)">Last week</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyPreset(lastMonth)">Last month</Button>
              <Button variant="ghost" size="sm" class="w-full justify-start" @click="applyPreset(lastYear)">Last year</Button>
            </div>
          </div>
        </div>
        <Calendar
          mode="single"
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
      Calendar with presets -
      <a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">
        React DayPicker
      </a>
    </p>
  </div>
</template>
