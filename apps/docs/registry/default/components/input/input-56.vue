<script setup lang="ts">
import { ref } from 'vue'
import { Input, Label } from '@timui/vue'

const id = 'input-56'
const value = ref('')

function formatTimestamp(input: string): string {
  const raw = input.replace(/\D/g, '').slice(0, 6)
  if (raw.length <= 2) return raw
  if (raw.length <= 4) return `${raw.slice(0, 2)}:${raw.slice(2)}`
  return `${raw.slice(0, 2)}:${raw.slice(2, 4)}:${raw.slice(4, 6)}`
}

function handleValueChange(nextValue: string | number) {
  value.value = formatTimestamp(String(nextValue))
}

</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Timestamp</Label>
    <Input
      :id="id"
      v-model="value"
      placeholder="00:00:00"
      type="text"
      @update:model-value="handleValueChange"
    />
    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with native mask formatting
    </p>
  </div>
</template>
