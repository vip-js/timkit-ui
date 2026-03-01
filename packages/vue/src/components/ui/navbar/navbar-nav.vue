<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, navbarNavVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <nav data-slot="navbar-nav" :class="cn(navbarNavVariants(), props.class)">
    <slot />
  </nav>
</template>
