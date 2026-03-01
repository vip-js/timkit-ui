<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, navbarVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <header data-slot="navbar" :class="cn(navbarVariants(), props.class)">
    <slot />
  </header>
</template>
