<script setup lang="ts">
import { Calendar } from '@/components/ui/calendar';



</script>

<template>
  <div><Calendar mode="single" :selected="date" :onSelect="setDate" class="rounded-md border p-2" fixedWeeks showWeekNumber :components="{
          WeekNumber: ({ week, ...props }: WeekNumberProps) => {
            return (
              <th {...props}>
                <span className="inline-flex size-9 items-center justify-center">
                  {week.weekNumber}
                </span>
              </th>
            )
          },
        }" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Weekly numbers -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
