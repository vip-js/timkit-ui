<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn, sheetDescriptionVariants } from "@timui/core";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <p :class="cn(sheetDescriptionVariants(), props.class)">
    <slot />
  </p>
</template>
