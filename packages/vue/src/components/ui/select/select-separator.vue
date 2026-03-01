<script setup lang="ts">
import { cn, selectSeparatorVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(selectSeparatorVariants(), props.class)">
    <slot />
  </div>
</template>
