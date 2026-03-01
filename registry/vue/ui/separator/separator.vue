<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cva } from '../../lib/cva'
import { cn } from '@/lib/utils'

const separatorVariants = cva('shrink-0 bg-border', {
  variants: {
    orientation: {
      horizontal: 'h-[1px] w-full',
      vertical: 'h-full w-[1px]',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    orientation: 'horizontal',
    decorative: true,
  }
)
</script>

<template>
  <div
    :role="props.decorative ? 'none' : 'separator'"
    :aria-orientation="props.decorative ? undefined : props.orientation"
    :class="cn(separatorVariants({ orientation: props.orientation }), props.class)"
  />
</template>
