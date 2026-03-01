<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const navigationMenuIndicatorVariants = cva(
    'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in'
)
const navigationMenuIndicatorIconVariants = cva(
    'relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md'
)

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    :class="cn(navigationMenuIndicatorVariants(), props.class)"
  >
    <div :class="navigationMenuIndicatorIconVariants()" />
  </div>
</template>
