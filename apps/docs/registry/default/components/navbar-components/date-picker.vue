<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';



</script>

<template>
  <Popover><PopoverTrigger as-child><Button variant="outline" size="sm" class="group bg-background border-input w-full justify-between px-3 text-sm font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"><CalendarIcon :size="16" class="text-muted-foreground/80 -ms-1 shrink-0 transition-colors" aria-hidden="true" /><span :class="cn('truncate', !date && 'font-medium')">{{ date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              'Date'
            ) }}</span></Button></PopoverTrigger><PopoverContent class="w-auto p-2" align="start"><Calendar mode="range" :selected="date" :onSelect="setDate" /></PopoverContent></Popover>
</template>
