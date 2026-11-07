<script setup lang="ts">
import { computed, watch } from 'vue'
import Calendar from '../calendar/calendar.vue'
import { useDateRangePickerContext } from '../date-range-picker/use-date-range-picker-context'

const context = useDateRangePickerContext()
const externalApi = computed(() => context?.value ?? undefined)

watch(
  () => context?.value?.value?.length ?? 0,
  (length, previous) => {
    if (previous === undefined || !context?.value) return
    if (length !== 1) context.value.setOpen(false)
  }
)
</script>

<template>
  <Calendar v-bind="$attrs" mode="range" :external-api="externalApi" />
</template>
