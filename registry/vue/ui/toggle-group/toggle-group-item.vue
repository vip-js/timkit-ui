<script setup lang="ts">
import { inject, computed, type HTMLAttributes } from 'vue'
import { ToggleGroupContextKey } from './toggle-group.vue'
import { cva } from '../../lib/cva'
import { cn } from '../../lib/utils'

// Context type definition
type ToggleGroupContextValue = {
  variant: 'default' | 'outline'
  size: 'default' | 'sm' | 'lg'
  api: any
  type: 'single' | 'multiple'
  disabled?: boolean
}

const toggleVariants = cva(
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
            },
            size: {
                default: 'h-10 px-3',
                sm: 'h-9 px-2.5',
                lg: 'h-11 px-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

const props = defineProps<{
  value: string
  disabled?: boolean
  class?: HTMLAttributes['class']
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}>()

const context = inject<ToggleGroupContextValue>(ToggleGroupContextKey)

const api = computed(() => context?.api.value)

const itemProps = computed(() => {
  if (!api.value) return {}
  return api.value.getItemProps({ value: props.value, disabled: props.disabled })
})

const computedClass = computed(() => {
  const variant = props.variant || context?.variant || 'default'
  const size = props.size || context?.size || 'default'
  return cn(toggleVariants({ variant, size }), props.class)
})
</script>

<template>
  <button v-bind="itemProps" :class="computedClass">
    <slot />
  </button>
</template>
