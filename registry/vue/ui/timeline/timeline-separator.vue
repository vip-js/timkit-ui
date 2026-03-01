<script setup lang="ts">
import { type HTMLAttributes, inject, type ComputedRef } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
const orientation = inject<ComputedRef<'horizontal' | 'vertical'>>('timeline-orientation')!
</script>

<template>
  <div
    data-slot="timeline-separator"
    :class="cn('bg-primary/10 absolute self-start group-last/timeline-item:hidden',
      orientation.value === 'horizontal'
        ? '-top-6 h-0.5 w-[calc(100%-1rem-0.25rem)] translate-x-4.5 -translate-y-1/2'
        : '-left-6 h-[calc(100%-1rem-0.25rem)] w-0.5 -translate-x-1/2 translate-y-4.5',
      props.class
    )"
    aria-hidden="true"
  />
</template>
