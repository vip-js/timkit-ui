<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn, sheetHeaderVariants } from "@timui/shared";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(sheetHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
