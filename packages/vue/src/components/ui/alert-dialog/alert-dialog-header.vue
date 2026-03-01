<script setup lang="ts">
import { cn, dialogHeaderVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn(dialogHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
