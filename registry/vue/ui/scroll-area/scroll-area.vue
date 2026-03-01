<script setup lang="ts">
import { cva } from "class-variance-authority";
import { cn } from '../../lib/utils'
import type { HTMLAttributes } from 'vue'

const scrollAreaVariants = cva('relative overflow-hidden')
const scrollAreaViewportVariants = cva('h-full w-full rounded-[inherit] overflow-auto')

const props = defineProps<{
  class?: HTMLAttributes['class']
  type?: 'auto' | 'always' | 'scroll' | 'hover'
}>()
</script>

<template>
  <div
    :class="cn(scrollAreaVariants(), props.class)"
  >
    <div :class="scrollAreaViewportVariants()">
      <slot />
    </div>
  </div>
</template>
