<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';



</script>

<template>
  <div><div class="*:not-first:mt-2"><Label :htmlFor="id">Date picker</Label><Popover :ids="{ trigger: id }"><PopoverTrigger as-child><Button :id="id" :variant="'outline'" class="group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><span :class="cn('truncate', !date && 'text-muted-foreground')">{{ date ? format(date, 'PPP') : 'Pick a date' }}</span><CalendarIcon :size="16" class="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors" aria-hidden="true" /></Button></PopoverTrigger><PopoverContent class="w-auto p-2" align="start"><Calendar mode="single" :selected="date" :onSelect="setDate" /></PopoverContent></Popover></div><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
