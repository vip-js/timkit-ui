<script setup lang="ts">
import { ref } from 'vue';
import { Calendar } from '@timui/vue';
import { addDays } from 'date-fns';


const date = ref<CalendarRangeValue | undefined>({
    from: today,
    to: addDays(today, 48),
  });


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

</script>

<template>
  <div><Calendar mode="range" :selected="date" @update:modelValue="setDate(next as CalendarRangeValue | undefined)" :numberOfMonths="3" pagedNavigation :showOutsideDays="false" class="rounded-md border p-2" :classNames="{
          months: 'sm:flex-col md:flex-row gap-8',
          month:
            'relative first-of-type:before:hidden before:absolute max-md:before:inset-x-2 max-md:before:h-px max-md:before:-top-4 md:before:inset-y-2 md:before:w-px before:bg-border md:before:-left-4',
        }" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Three months calendar -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
