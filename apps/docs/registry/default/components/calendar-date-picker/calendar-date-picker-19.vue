<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@timui/vue';
import { Calendar } from '@timui/vue';
import { ScrollArea } from '@timui/vue';
import { format } from 'date-fns';


const date = ref<Date>(today);
const time = ref<string | null>(null);


function setDate(next: typeof date.value | ((prev: typeof date.value) => typeof date.value)) {
  date.value = typeof next === 'function'
    ? (next as (prev: typeof date.value) => typeof date.value)(date.value)
    : next;
}

function setTime(next: typeof time.value | ((prev: typeof time.value) => typeof time.value)) {
  time.value = typeof next === 'function'
    ? (next as (prev: typeof time.value) => typeof time.value)(time.value)
    : next;
}


const timeSlots = [
    { time: '09:00', available: false },
    { time: '09:30', available: false },
    { time: '10:00', available: true },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '12:30', available: true },
    { time: '13:00', available: true },
    { time: '13:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: false },
    { time: '15:00', available: false },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
  ]

</script>

<template>
  <div><div class="rounded-md border"><div class="flex max-sm:flex-col"><Calendar mode="single" :selected="date" @update:modelValue="{
              if (newDate) {
                setDate(newDate)
                setTime(null)
              }
            }" class="p-2 sm:pe-5" :disabled="[
              { before: today }, // Dates before today
            ]" /><div class="relative w-full max-sm:h-48 sm:w-40"><div class="absolute inset-0 py-4 max-sm:border-t"><ScrollArea class="h-full sm:border-s"><div class="space-y-3"><div class="flex h-5 shrink-0 items-center px-5"><p class="text-sm font-medium">{{ format(date, 'EEEE, d') }}</p></div><div class="grid gap-1.5 px-5 max-sm:grid-cols-2"><Button v-for="({ time: timeSlot, available }, index) in timeSlots" :key="timeSlot" :variant="time === timeSlot ? 'default' : 'outline'" size="sm" class="w-full" @click="setTime(timeSlot)" :disabled="!available">{{ timeSlot }}</Button></div></div></ScrollArea></div></div></div></div><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Appointment picker -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
