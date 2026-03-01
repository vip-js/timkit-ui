<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { badgeVariants } from '@timui/core'
import { cn } from '@timui/core'

type Props = {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <span
    data-slot="badge"
    :class="cn(badgeVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </span>
</template>
