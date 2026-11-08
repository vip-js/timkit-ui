<script setup lang="ts">
import { computed, useAttrs, type HTMLAttributes } from 'vue'
import { cn, navbarNavVariants } from '@timui/core'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const attrs = useAttrs()
const ariaLabel = computed(() => {
  if (typeof attrs['aria-labelledby'] === 'string' && attrs['aria-labelledby']) return undefined
  return typeof attrs['aria-label'] === 'string' && attrs['aria-label'] ? attrs['aria-label'] : 'Navigation'
})
</script>

<template>
  <nav
    data-slot="navbar-nav"
    :aria-label="ariaLabel"
    :class="cn(navbarNavVariants(), props.class)"
  >
    <slot />
  </nav>
</template>
