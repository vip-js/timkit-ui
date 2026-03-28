<script setup lang="ts">
import { Calendar } from '@timui/vue';
import { addDays } from 'date-fns';



</script>

<template>
  <div><Calendar mode="range" :disabled="[
          { before: new Date() }, // Dates before today
          new Date(), // Today
          { dayOfWeek: [0, 6] }, // Weekends
          {
            from: addDays(today, 14), // 14th day from now
            to: addDays(today, 16), // 16th day from now
          },
          {
            from: addDays(today, 23), // 23th day from now
            to: addDays(today, 24), // 24th day from now
          },
        ]" excludeDisabled class="rounded-md border p-2" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Disabled dates -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
