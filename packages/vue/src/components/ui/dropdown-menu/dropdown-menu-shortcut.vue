<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, dropdownMenuShortcutVariants } from '@timui/core'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    data-slot="dropdown-menu-shortcut"
    aria-hidden="true"
    :class="cn(dropdownMenuShortcutVariants(), props.class)"
  >
    <slot />
  </span>
</template>
