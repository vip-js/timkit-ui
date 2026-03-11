<script setup lang="ts">
import { Calendar } from '@/components/ui/calendar';



</script>

<template>
  <div><Calendar mode="range" :selected="date" :onSelect="setDate" :numberOfMonths="2" pagedNavigation :showOutsideDays="false" class="rounded-md border p-2" :classNames="{
          months: 'gap-8',
          month:
            'relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:-top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-4',
        }" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Two months calendar -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
