<script setup lang="ts">
import { ref } from 'vue';
import { Calendar } from '@timui/vue';
import { addDays } from 'date-fns';


const date = ref<CalendarRangeValue | undefined>({
    from: today,
    to: addDays(today, 3),
  });


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

</script>

<template>
  <div><Calendar mode="range" :selected="date" @update:modelValue="setDate(next as CalendarRangeValue | undefined)" class="rounded-md border p-2" :classNames="{
          day: 'relative before:absolute before:inset-y-px before:inset-x-0 [&.range-start:not(.range-end):before]:bg-linear-to-r before:from-transparent before:from-50% before:to-accent before:to-50% [&.range-end:not(.range-start):before]:bg-linear-to-l',
          day_button:
            'rounded-full group-[.range-start:not(.range-end)]:rounded-e-full group-[.range-end:not(.range-start)]:rounded-s-full',
        }" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Custom select range style -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
