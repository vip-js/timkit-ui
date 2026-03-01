<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaCorner, type ScrollAreaRootProps } from 'radix-vue'
import ScrollBar from './scroll-bar.vue'
import { cn, scrollAreaVariants, scrollAreaViewportVariants } from '@timui/core'
import type { HTMLAttributes } from 'vue'

const props = defineProps<ScrollAreaRootProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <ScrollAreaRoot
    v-bind="props"
    :class="cn(scrollAreaVariants(), props.class)"
  >
    <ScrollAreaViewport :class="scrollAreaViewportVariants()">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
