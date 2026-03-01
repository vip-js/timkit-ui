<script setup lang="ts">
import { type HTMLAttributes, inject, type ComputedRef } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const orientation = inject<ComputedRef<'horizontal' | 'vertical'>>('timeline-orientation')!
</script>

<template>
  <div
    data-slot="timeline-indicator"
    :class="cn('border-primary/20 group-data-completed/timeline-item:border-primary absolute size-4 rounded-full border-2',
      orientation.value === 'horizontal' ? '-top-6 left-0 -translate-y-1/2' : 'top-0 -left-6 -translate-x-1/2',
      props.class
    )"
    aria-hidden="true"
  >
    <slot />
  </div>
</template>
