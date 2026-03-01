<script setup lang="ts">
import { computed, watch, type HTMLAttributes } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import * as progress from '@zag-js/progress'
import { cva } from '../../lib/cva'
import { cn } from '../../lib/utils'

const progressRootVariants = cva(
    'relative h-2 w-full overflow-hidden rounded-full bg-secondary'
)
const progressIndicatorVariants = cva('h-full w-full flex-1 bg-primary transition-all')

const props = defineProps<{
  modelValue?: number | null
  max?: number
  class?: HTMLAttributes['class']
}>()

const machineProps = computed(() => ({
  value: props.modelValue ?? null,
  max: props.max ?? 100,
}))

const service = useMachine(progress.machine, machineProps)
const api = computed(() => progress.connect(service, normalizeProps))

const percent = computed(() => {
  return api.value.percent
})

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== api.value.value) {
      api.value.setValue(val)
    }
  },
)
</script>

<template>
  <div
    v-bind="api.getRootProps()"
     data-slot="progress"
    :class="cn(progressRootVariants(), props.class)"
  >
    <div
      v-bind="api.getTrackProps()"
      :class="progressIndicatorVariants()"
      :style="`transform: translateX(-${100 - percent}%);`"
    />
  </div>
</template>
