<script setup lang="ts">
import { cn } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn('p-1 w-full', props.class)">
    <slot />
  </div>
</template>
