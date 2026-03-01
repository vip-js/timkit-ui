<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { cva } from '../../lib/cva'

const selectNativeVariants = cva(
  'border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 has-[option[disabled]:checked]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-full cursor-pointer appearance-none items-center rounded-md border text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      multiple: {
        true: '[&_option:checked]:bg-accent py-1 *:px-3 *:py-1',
        false: 'h-9 ps-3 pe-8',
      },
    },
    defaultVariants: {
      multiple: false,
    },
  }
)

interface Props {
  multiple?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
})
</script>

<template>
  <div class="relative flex">
    <select
      data-slot="select-native"
      :class="cn(selectNativeVariants({ multiple: props.multiple }), props.class)"
      :multiple="props.multiple"
      v-bind="$attrs"
    >
      <slot />
    </select>
    <span
      v-if="!props.multiple"
      class="text-muted-foreground/80 peer-aria-invalid:text-destructive/80 pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center peer-disabled:opacity-50"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </span>
  </div>
</template>
