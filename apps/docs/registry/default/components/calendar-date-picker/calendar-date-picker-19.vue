<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';



</script>

<template>
  <div><div class="rounded-md border"><div class="flex max-sm:flex-col"><Calendar mode="single" :selected="date" :onSelect="(newDate) => {
              if (newDate) {
                setDate(newDate)
                setTime(null)
              }
            }" class="p-2 sm:pe-5" :disabled="[
              { before: today }, // Dates before today
            ]" /><div class="relative w-full max-sm:h-48 sm:w-40"><div class="absolute inset-0 py-4 max-sm:border-t"><ScrollArea class="h-full sm:border-s"><div class="space-y-3"><div class="flex h-5 shrink-0 items-center px-5"><p class="text-sm font-medium">{{ format(date, 'EEEE, d') }}</p></div><div class="grid gap-1.5 px-5 max-sm:grid-cols-2"><Button v-for="({ time: timeSlot, available }, index) in timeSlots" :key="index" :key="timeSlot" :variant="time === timeSlot ? 'default' : 'outline'" size="sm" class="w-full" @click="setTime(timeSlot)" :disabled="!available">{{ timeSlot }}</Button></div></div></ScrollArea></div></div></div></div><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Appointment picker -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
