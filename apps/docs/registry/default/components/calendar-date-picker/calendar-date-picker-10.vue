<script setup lang="ts">
import { Calendar } from '@/components/ui/calendar';



</script>

<template>
  <div><Calendar mode="single" :selected="date" :onSelect="setDate" class="rounded-md border p-2" :classNames="{
          month_caption: 'ms-2.5 me-20 justify-start',
          nav: 'justify-end',
        }" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Right navigation -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
