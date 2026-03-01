<script setup lang="ts">
import { type HTMLAttributes, computed, useAttrs } from 'vue'
import { cva } from '../../lib/cva'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const inputVariants = cva(
  'border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      type: {
        default: '',
        search: '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
        file: 'text-muted-foreground/70 file:border-input file:text-foreground p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic',
      },
    },
    defaultVariants: {
      type: 'default',
    },
  }
)

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const attrs = useAttrs()
const modelValue = defineModel<string | number>({ required: false })

const inputType = computed(() => {
  const type = attrs.type
  if (type === 'search') return 'search'
  if (type === 'file') return 'file'
  return 'default'
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(inputVariants({ type: inputType }), props.class)"
    v-bind="$attrs"
  />
</template>
