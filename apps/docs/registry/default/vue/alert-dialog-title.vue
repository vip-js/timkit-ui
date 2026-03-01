<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <h2 :class="cn('text-lg font-semibold', props.class)">
    <slot />
  </h2>
</template>
