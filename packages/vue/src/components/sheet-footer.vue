<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn, sheetFooterVariants } from "@timui/shared";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(sheetFooterVariants(), props.class)">
    <slot />
  </div>
</template>
