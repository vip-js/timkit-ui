<script setup lang="ts">
import { type HTMLAttributes, inject, type ComputedRef } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  step: number
  class?: HTMLAttributes['class']
}>()

const activeStep = inject<ComputedRef<number>>('timeline-active-step')!
const orientation = inject<ComputedRef<'horizontal' | 'vertical'>>('timeline-orientation')!
</script>

<template>
  <div
    data-slot="timeline-item"
    :class="cn('group/timeline-item has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-primary relative flex flex-1 flex-col gap-0.5',
      orientation === 'horizontal' ? 'mt-8 not-last:pe-8' : 'ms-8 not-last:pb-12',
      props.class
    )"
    :data-completed="props.step <= activeStep.value || undefined"
    :data-orientation="orientation.value"
  >
    <slot />
  </div>
</template>
