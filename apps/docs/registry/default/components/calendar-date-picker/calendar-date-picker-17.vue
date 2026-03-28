<script setup lang="ts">
import { ref } from 'vue';
import { ClockIcon } from 'lucide-vue-next';
import { Calendar } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';



const date = ref<Date | undefined>(new Date());


const id = 'calendar-date-picker-17';


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

</script>

<template>
  <div><div class="rounded-md border"><Calendar mode="single" class="p-2" :selected="date" @update:modelValue="setDate" /><div class="border-t p-3"><div class="flex items-center gap-3"><Label :htmlFor="id" class="text-xs">Enter time
            </Label><div class="relative grow"><Input :id="id" type="time" step="1" default-value="12:00:00" class="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none" /><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"><ClockIcon :size="16" aria-hidden="true" /></div></div></div></div></div><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Time input -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
