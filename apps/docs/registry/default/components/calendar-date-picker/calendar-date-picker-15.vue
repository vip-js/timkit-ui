<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';



</script>

<template>
  <div><div class="rounded-md border p-2"><Calendar mode="single" :selected="date" :onSelect="setDate" :month="month" :onMonthChange="setMonth" /><Button variant="outline" size="sm" class="mt-2 mb-1" @click="{
            setDate(today)
            setMonth(today)
          }">Today
        </Button></div><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">With button -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
