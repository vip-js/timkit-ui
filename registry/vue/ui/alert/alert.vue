<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cva, type VariantProps } from '../../lib/cva'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border border-border bg-background p-4 text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type Props = {
  variant?: VariantProps<typeof alertVariants>['variant']
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div
    role="alert"
    data-slot="alert"
    :class="cn(alertVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </div>
</template>
