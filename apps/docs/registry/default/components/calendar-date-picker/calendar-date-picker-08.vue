<script setup lang="ts">
import { Calendar } from '@/components/ui/calendar';



</script>

<template>
  <div><Calendar mode="single" :selected="date" :onSelect="setDate" class="rounded-md border p-2" :classNames="{
          day_button: 'rounded-full',
        }" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Custom select day style -{{ ' ' }}<a class="hover:text-foreground underline" href="https://daypicker.dev/" target="_blank" rel="noopener nofollow">React DayPicker
        </a></p></div>
</template>
