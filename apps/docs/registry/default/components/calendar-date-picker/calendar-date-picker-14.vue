<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@timui/vue';
import { Calendar } from '@timui/vue';
import { addDays } from 'date-fns';


const month = ref(selectedDay);
const date = ref<Date | undefined>(selectedDay);


function setMonth(next: typeof month.value | ((prev: typeof month.value) => typeof month.value)) {
  month.value = typeof next === 'function'
    ? (next as (prev: typeof month.value) => typeof month.value)(month.value)
    : next;
}


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

</script>

<template>
  <div><div class="rounded-md border p-2"><Calendar mode="single" :selected="date" @update:modelValue="setDate" :month="month" :onMonthChange="setMonth" /><Button variant="outline" size="sm" class="mt-2 mb-1" @click="setMonth(today)">Current month
        </Button></div><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">With button -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
