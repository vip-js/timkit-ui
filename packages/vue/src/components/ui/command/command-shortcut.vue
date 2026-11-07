<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, commandShortcutVariants } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    data-slot="command-shortcut"
    aria-hidden="true"
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
