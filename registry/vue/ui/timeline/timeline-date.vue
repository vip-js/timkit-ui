<script setup lang="ts">
import { type HTMLAttributes, inject, type ComputedRef } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  asChild?: boolean
  class?: HTMLAttributes['class']
}>()
const orientation = inject<ComputedRef<'horizontal' | 'vertical'>>('timeline-orientation')!
</script>

<template>
  <component
    :is="asChild ? 'slot' : 'time'"
    data-slot="timeline-date"
    :class="cn('text-muted-foreground mb-1 block text-xs font-medium',
      orientation.value === 'vertical' ? 'max-sm:h-4' : '',
      props.class
    )"
  >
    <slot />
  </component>
</template>
