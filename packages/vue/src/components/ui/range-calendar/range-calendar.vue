<script setup lang="ts">
import { computed } from 'vue'
import Calendar from '../calendar/calendar.vue'
import { useDateRangePickerContext } from '../date-range-picker/use-date-range-picker-context'

const context = useDateRangePickerContext()
const externalApi = computed(() => context?.value ?? undefined)
</script>

<template>
  <Calendar v-bind="$attrs" mode="range" :external-api="externalApi" />
</template>
