<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn, timelineHeaderVariants } from '@timui/core';

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div data-slot="timeline-header" :class="cn(timelineHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
