<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn, timelineItemVariants } from '@timui/core';
import { injectTimelineContext } from "./timeline-context";

const props = defineProps<{
  step: number;
  class?: HTMLAttributes["class"];
}>();

const context = injectTimelineContext();

if (!context) {
  throw new Error("TimelineItem must be used within a Timeline");
}
</script>

<template>
  <div
    data-slot="timeline-item"
    :class="cn(timelineItemVariants(), props.class)"
    :data-completed="props.step <= context.activeStep.value ? '' : undefined"
  >
    <slot />
  </div>
</template>
