<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, commandShortcutVariants } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    :class="
      cn(
        commandShortcutVariants(),
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
