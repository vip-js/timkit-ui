<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { injectTimelineContext } from "./timeline-context";

const props = defineProps<{
  step: number;
  class?: HTMLAttributes["class"];
}>();

const context = injectTimelineContext("TimelineItem");

if (!context) {
  throw new Error("TimelineItem must be used within a Timeline");
}
</script>

<template>
  <div
    data-slot="timeline-item"
    :class="
      cn(
        'group/timeline-item has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-primary relative flex flex-1 flex-col gap-0.5 group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=vertical]/timeline:not-last:pb-12',
        props.class
      )
    "
    :data-completed="props.step <= context.activeStep.value ? '' : undefined"
  >
    <slot />
  </div>
</template>
