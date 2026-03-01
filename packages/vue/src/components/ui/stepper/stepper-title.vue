<script setup lang="ts">
import { cn, stepperTitleVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <h3 data-slot="stepper-title" :class="cn(stepperTitleVariants(), props.class)">
    <slot />
  </h3>
</template>
