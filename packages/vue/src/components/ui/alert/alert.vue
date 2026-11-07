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
    :data-variant="props.variant || 'default'"
    :class="cn(alertVariants({ variant: props.variant }), props.class)"
  >
    <p v-if="props.variant === 'destructive'" role="status">Destructive</p>
    <slot />
  </div>
</template>
