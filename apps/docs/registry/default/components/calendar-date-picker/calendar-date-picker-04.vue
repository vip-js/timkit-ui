<script setup lang="ts">
import { ref } from 'vue';
import { Calendar } from '@timui/vue';



const date = ref<Date | undefined>(new Date());


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

</script>

<template>
  <div><Calendar mode="single" :selected="date" @update:modelValue="setDate" class="rounded-md border p-2" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Calendar -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
