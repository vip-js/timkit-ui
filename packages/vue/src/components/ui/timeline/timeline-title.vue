<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn, timelineTitleVariants } from '@timui/core';

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h3 data-slot="timeline-title" :class="cn(timelineTitleVariants(), props.class)">
    <slot />
  </h3>
</template>
