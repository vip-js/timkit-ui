<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn, timelineContentVariants } from '@timui/core';

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-slot="timeline-content"
    :class="cn(timelineContentVariants(), props.class)"
  >
    <slot />
  </div>
</template>
