<script setup lang="ts">
import { useAttrs, type HTMLAttributes } from 'vue'
import { cn, navbarNavVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const attrs = useAttrs()
</script>

<template>
  <nav
    data-slot="navbar-nav"
    :aria-label="attrs['aria-labelledby'] ? undefined : attrs['aria-label'] || 'Navigation'"
    :class="cn(navbarNavVariants(), props.class)"
  >
    <slot />
  </nav>
</template>
