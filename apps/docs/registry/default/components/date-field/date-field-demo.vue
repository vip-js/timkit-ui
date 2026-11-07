<script setup lang="ts">
import { ref } from 'vue'
import { DateField, DateInput } from '@timui/vue'

const value = ref('2026-11-07')
const onValueChange = (next: string) => {
  value.value = next
}
</script>

<template>
  <DateField :value="value" :on-value-change="onValueChange">
    <DateInput aria-label="Date" />
  </DateField>
  <p>{{ value || 'Empty' }}</p>
  <button type="button" @click="value = ''">Clear</button>
</template>
