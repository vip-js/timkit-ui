<script setup lang="ts">
import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { Calendar } from '@timui/vue'

const today = new Date()
const startDate = new Date(1980, 6)
const endDate = new Date(2030, 6)

const month = ref<Date>(today)
const date = ref<Date | undefined>(today)

const yearOptions = computed(() => {
  const years: number[] = []
  for (let y = startDate.getFullYear(); y <= endDate.getFullYear(); y += 1) {
    years.push(y)
  }
  return years
})

const monthOptions = computed(() =>
  Array.from({ length: 12 }, (_, index) => ({
    value: index,
    label: format(new Date(2000, index, 1), 'MMM'),
  }))
)

function setMonth(next: Date) {
  month.value = next
}

function setDate(next: Date | undefined) {
  date.value = next
  if (next) {
    month.value = next
  }
}

function handleYearChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const year = Number(target.value)
  if (Number.isNaN(year)) return
  month.value = new Date(year, month.value.getMonth(), 1)
}

function handleMonthChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const selectedMonth = Number(target.value)
  if (Number.isNaN(selectedMonth)) return
  month.value = new Date(month.value.getFullYear(), selectedMonth, 1)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <select
        class="border-input bg-background h-8 rounded-md border px-2 text-sm"
        :value="month.getMonth()"
        @change="handleMonthChange"
      >
        <option v-for="option in monthOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <select
        class="border-input bg-background h-8 rounded-md border px-2 text-sm"
        :value="month.getFullYear()"
        @change="handleYearChange"
      >
        <option v-for="year in yearOptions" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <Calendar
      mode="single"
      :selected="date"
      @update:modelValue="setDate"
      :month="month"
      :onMonthChange="setMonth"
      :defaultMonth="today"
      :startMonth="startDate"
      :endMonth="endDate"
      class="overflow-hidden rounded-md border p-2"
      :classNames="{ month_caption: 'ms-2.5 me-20 justify-start', nav: 'justify-end' }"
    />

    <p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">
      Advanced selection -
      <a
        class="hover:text-foreground underline"
        href="https://daypicker.dev/"
        target="_blank"
        rel="noopener nofollow"
      >
        React DayPicker
      </a>
    </p>
  </div>
</template>
