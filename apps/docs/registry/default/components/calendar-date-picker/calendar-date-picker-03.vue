<script setup lang="ts">
import { ref } from 'vue'
import { RangeCalendar } from '@timui/vue'

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return startOfDay(next)
}

const now = startOfDay(new Date())
const disabledRanges: Array<[Date, Date]> = [
  [now, now],
  [addDays(now, 14), addDays(now, 14)],
  [addDays(now, 23), addDays(now, 23)],
]

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



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div>
    <RangeCalendar @click="onDemoClick" class="rounded-md border p-2" :isDateUnavailable="isDateUnavailable" :minDate="now" />

    <p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">
      Disabled dates -
      <a
        class="hover:text-foreground underline"
        href="https://react-spectrum.adobe.com/react-aria/DateRangePicker.html"
        target="_blank"
        rel="noopener nofollow"
      >
        React Aria
      </a>
    </p>
  </div>
</template>
