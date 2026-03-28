<script setup lang="ts">
import { ref } from 'vue';
import { RangeCalendar } from '@timui/vue';

type CalendarRangeValue = { from?: Date; to?: Date } | undefined;

const now = new Date();
const date = ref<CalendarRangeValue>({
  from: now,
  to: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
});

function setDate(next: CalendarRangeValue) {
  date.value = next;
}
</script>

<template>
  <div>
    <RangeCalendar class="rounded-md border p-2" :selected="date" @update:modelValue="setDate" />
    <p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">
      Range calendar -
      <a class="hover:text-foreground underline" href="https://react-spectrum.adobe.com/react-aria/DateRangePicker.html" target="_blank" rel="noopener nofollow">React Aria</a>
    </p>
  </div>
</template>
