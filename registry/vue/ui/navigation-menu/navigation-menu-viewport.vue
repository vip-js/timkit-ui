<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const navigationMenuViewportWrapperVariants = cva('absolute left-0 top-full flex justify-center')
const navigationMenuViewportVariants = cva(
    'origin-top-center relative mt-1.5 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-auto'
)

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div :class="navigationMenuViewportWrapperVariants()">
    <div
      :class="cn(navigationMenuViewportVariants(), props.class)"
    >
      <slot />
    </div>
  </div>
</template>
