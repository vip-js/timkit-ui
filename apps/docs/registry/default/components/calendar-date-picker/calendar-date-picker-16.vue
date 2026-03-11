<script setup lang="ts">
import { CalendarIcon } from 'lucide-vue-next';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';



</script>

<template>
  <div><div class="rounded-md border"><Calendar mode="single" class="p-2" :selected="date" :onSelect="handleDayPickerSelect" :month="month" :onMonthChange="setMonth" /><div class="border-t p-3"><div class="flex items-center gap-3"><Label :htmlFor="id" class="text-xs">Enter date
            </Label><div class="relative grow"><Input :id="id" type="date" :value="inputValue" :onChange="handleInputChange" class="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none" aria-label="Select date" /><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"><CalendarIcon :size="16" aria-hidden="true" /></div></div></div></div></div><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Date input -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
