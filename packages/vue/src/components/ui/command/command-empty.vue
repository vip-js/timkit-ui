<script setup lang="ts">
import { cn, commandEmptyVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(commandEmptyVariants(), props.class)">
    <slot />
  </div>
</template>
