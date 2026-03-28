<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@timui/vue'

const date = ref<Date | undefined>(new Date())

function setDate(next: Date | Date[] | { from?: Date; to?: Date } | undefined) {
  date.value = next instanceof Date || next === undefined ? next : date.value
}
</script>

<template>
  <div>
    <Calendar
      class="rounded-md border p-2"
      mode="single"
      :selected="date"
      @update:modelValue="setDate"
    />

    <p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">
      Calendar -
      <a
        class="hover:text-foreground underline"
        href="https://react-spectrum.adobe.com/react-aria/DateRangePicker.html"
        target="_blank"
        rel="noopener nofollow"
      >
        React Aria
      </a>
    </p>
  </div>
</template>
