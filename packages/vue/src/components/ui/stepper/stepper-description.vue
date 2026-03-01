<script setup lang="ts">
import { cn, stepperDescriptionVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <p
    data-slot="stepper-description"
    :class="cn(stepperDescriptionVariants(), props.class)"
  >
    <slot />
  </p>
</template>
