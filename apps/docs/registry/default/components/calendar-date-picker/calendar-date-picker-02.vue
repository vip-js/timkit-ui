<script setup lang="ts">
import { RangeCalendar } from '@/components/ui/range-calendar';



</script>

<template>
  <div><RangeCalendar class="rounded-md border p-2" :value="date" :onChange="setDate" /><p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">Range calendar -{{ ' ' }}<a class="hover:text-foreground underline" href="https://react-spectrum.adobe.com/react-aria/DateRangePicker.html" target="_blank" rel="noopener nofollow">React Aria
        </a></p></div>
</template>
