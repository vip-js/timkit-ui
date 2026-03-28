<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@timui/vue'

const date = ref<Date | undefined>(new Date())

function setDate(next: Date | undefined) {
  date.value = next
}
</script>

<template>
  <div>
    <Calendar
      mode="single"
      :selected="date"
      @update:modelValue="setDate"
      class="rounded-md border p-2"
      captionLayout="dropdown-years"
      :defaultMonth="new Date()"
      :startMonth="new Date(1980, 6)"
      :classNames="{ nav: 'justify-center' }"
    />
    <p class="text-muted-foreground mt-4 text-center text-xs" role="region" aria-live="polite">
      Yearly select + nav -
      <a
        class="hover:text-foreground underline"
        href="https://daypicker.dev/"
        target="_blank"
        rel="noopener nofollow"
      >
        React DayPicker
      </a>
    </p>
  </div>
</template>
