<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Calendar } from '@timui/vue'
import { format } from 'date-fns'

const today = new Date()
const date = ref<Date | undefined>(today)
const mockPriceData = ref<Record<string, number>>({})

function setDate(next: Date | undefined) {
  date.value = next
}

onMounted(() => {
  const data: Record<string, number> = {}
  for (let i = 0; i < 180; i += 1) {
    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + i)
    const dateKey = format(nextDate, 'yyyy-MM-dd')
    data[dateKey] = Math.floor(Math.random() * (200 - 80 + 1)) + 80
  }
  mockPriceData.value = data
})

function isDateDisabled(targetDate: Date) {
  return !mockPriceData.value[format(targetDate, 'yyyy-MM-dd')]
}

const selectedPrice = computed(() => {
  if (!date.value) return undefined
  return mockPriceData.value[format(date.value, 'yyyy-MM-dd')]
})
</script>

<template>
  <div>
    <Calendar
      mode="single"
      :selected="date"
      @update:modelValue="setDate"
      :numberOfMonths="2"
      pagedNavigation
      :showOutsideDays="false"
      class="rounded-md border p-2"
      :classNames="{
        months: 'sm:flex-col md:flex-row gap-8',
        month:
          'relative first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:h-px max-md:before:-top-4 md:before:inset-y-2 md:before:w-px before:bg-border md:before:-left-4',
        weekday: 'w-12',
        day_button: 'size-12',
        today: '*:after:hidden',
      }"
      :disabled="isDateDisabled"
    />

    <p class="text-foreground mt-3 text-center text-sm" role="status" aria-live="polite">
      <template v-if="date && selectedPrice">
        {{ format(date, 'yyyy-MM-dd') }} · ${{ selectedPrice }}
      </template>
      <template v-else>No price selected</template>
    </p>

    <p class="text-muted-foreground mt-2 text-center text-xs" role="region" aria-live="polite">
      Pricing calendar -
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
