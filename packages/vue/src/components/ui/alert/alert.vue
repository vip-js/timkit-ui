<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { alertVariants } from '@timui/core'
import { cn } from '@timui/core'

type Props = {
  variant?: 'default' | 'destructive'
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
