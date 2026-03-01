<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const navigationMenuContentVariants = cva(
    'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto'
)

const props = defineProps<{
  class?: HTMLAttributes["class"]
  forceMount?: boolean
}>()
</script>

<template>
  <div
    :class="cn(navigationMenuContentVariants(), props.class)"
  >
    <slot />
  </div>
</template>
