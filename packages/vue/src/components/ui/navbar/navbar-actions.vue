<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, navbarActionsVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="navbar-actions" :class="cn(navbarActionsVariants(), props.class)">
    <slot />
  </div>
</template>
