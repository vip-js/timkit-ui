<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cva, type VariantProps } from '../../lib/cva'
import { cn } from '@/lib/utils'

const notificationVariants = cva(
  'bg-background border-border relative flex w-full flex-col gap-1 rounded-lg border p-4 shadow-lg'
)

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div
    data-slot="notification"
    :class="cn(notificationVariants(), props.class)"
  >
    <slot />
  </div>
</template>
