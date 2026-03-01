<script setup lang="ts">
import { type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h3 data-slot="timeline-title" :class="cn('text-sm font-medium', props.class)">
    <slot />
  </h3>
</template>
