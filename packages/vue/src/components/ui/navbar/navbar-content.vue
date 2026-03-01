<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn, navbarContentVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <div
    data-slot="navbar-content"
    :class="cn(navbarContentVariants(), props.class)"
  >
    <slot />
  </div>
</template>
