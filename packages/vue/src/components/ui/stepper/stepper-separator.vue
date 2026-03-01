<script setup lang="ts">
import { cn, stepperSeparatorVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="stepper-separator"
    :class="cn(stepperSeparatorVariants(), props.class)"
  />
</template>
