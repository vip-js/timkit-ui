<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    orientation: "horizontal",
    decorative: true,
  }
);
</script>

<template>
  <div
    :role="props.decorative ? 'none' : 'separator'"
    :aria-orientation="props.decorative ? undefined : props.orientation"
    :class="
      cn(
        'shrink-0 bg-border',
        props.orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        props.class
      )
    "
  />
</template>
