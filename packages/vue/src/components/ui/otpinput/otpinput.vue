<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    id?: string
    maxLength?: number | string
  }>(),
  {
    maxLength: 6,
  }
)

const resolvedMaxLength = computed(() => {
  const raw = typeof props.maxLength === 'string' ? Number(props.maxLength) : props.maxLength
  if (!Number.isFinite(raw) || raw <= 0) return 6
  return Math.floor(raw)
})
</script>

<template>
  <input
    :id="id"
    type="text"
    inputmode="numeric"
    autocomplete="one-time-code"
    :maxlength="resolvedMaxLength"
    v-bind="$attrs"
  />
</template>
