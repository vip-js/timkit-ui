<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { progressIndicatorVariants, progressRootVariants } from '@timui/core'
import { cn } from '@timui/core'
import { useProgress } from './use-progress'

const props = defineProps<{
  modelValue?: number | null
  max?: number
  class?: HTMLAttributes['class']
}>()

const api = useProgress(props)

const percent = computed(() => {
  return api.value.percent
})
</script>

<template>
  <div
    role="progressbar"
    data-slot="progress"
    :aria-valuemax="props.max ?? 100"
    aria-valuemin="0"
    :aria-valuenow="props.modelValue ?? undefined"
    :data-max="props.max ?? 100"
    :data-value="props.modelValue ?? undefined"
    :data-state="props.modelValue == null ? 'indeterminate' : 'loading'"
    :class="cn(progressRootVariants(), props.class)"
  >
    <div
      data-slot="progress-indicator"
      :class="progressIndicatorVariants()"
      :style="`transform: translateX(-${100 - percent}%);`"
    />
  </div>
</template>
