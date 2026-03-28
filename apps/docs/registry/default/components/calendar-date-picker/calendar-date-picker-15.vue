<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue'
import { Calendar } from '@timui/vue'
import { addDays } from 'date-fns'

const today = new Date()
const selectedDay = addDays(today, -2)

const month = ref<Date>(selectedDay)
const date = ref<Date | undefined>(selectedDay)

const setDate = (next?: Date) => {
  date.value = next
}

const setMonth = (next: Date) => {
  month.value = next
}

const goToday = () => {
  setDate(today)
  setMonth(today)
}
</script>

<template>
  <div>
    <div class="rounded-md border p-2">
      <Calendar
        mode="single"
        :selected="date"
        :month="month"
        :onMonthChange="setMonth"
        @update:modelValue="setDate"
      />
      <Button variant="outline" size="sm" class="mt-2 mb-1" @click="goToday">Today</Button>
    </div>
    <p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">
      With button -
      <a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">
        React DayPicker
      </a>
    </p>
  </div>
</template>
