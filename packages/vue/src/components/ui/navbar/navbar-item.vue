<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, navbarItemVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="navbar-item" :class="cn(navbarItemVariants(), props.class)">
    <slot />
  </div>
</template>
