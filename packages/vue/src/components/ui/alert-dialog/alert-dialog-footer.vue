<script setup lang="ts">
import { cn, dialogFooterVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn(dialogFooterVariants(), props.class)">
    <slot />
  </div>
</template>
