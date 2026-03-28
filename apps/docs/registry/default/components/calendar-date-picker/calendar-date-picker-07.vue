<script setup lang="ts">
import { ref } from 'vue';
import { Calendar } from '@timui/vue';
import { addDays, subDays } from 'date-fns';


const date = ref<Date[] | undefined>([
    subDays(today, 17),
    addDays(today, 2),
    addDays(today, 6),
    addDays(today, 8),
  ]);


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

</script>

<template>
  <div><Calendar mode="multiple" :selected="date" @update:modelValue="setDate" class="rounded-md border p-2" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Multiple day selection -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
