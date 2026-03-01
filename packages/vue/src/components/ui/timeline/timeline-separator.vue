<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn, timelineSeparatorVariants } from '@timui/core';

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-slot="timeline-separator"
    :class="cn(timelineSeparatorVariants(), props.class)"
    aria-hidden="true"
  />
</template>
