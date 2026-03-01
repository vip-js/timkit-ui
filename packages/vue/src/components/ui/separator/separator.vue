<script setup lang="ts">
import { cn, separatorVariants } from "@timui/core";
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
    :class="cn(separatorVariants({ orientation: props.orientation }), props.class)"
  />
</template>
