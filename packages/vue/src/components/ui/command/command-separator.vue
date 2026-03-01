<script setup lang="ts">
import { cn, commandSeparatorVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(commandSeparatorVariants(), props.class)">
    <slot />
  </div>
</template>
