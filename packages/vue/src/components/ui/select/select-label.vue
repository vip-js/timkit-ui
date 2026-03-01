<script setup lang="ts">
import { cn, selectLabelVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(selectLabelVariants(), props.class)">
    <slot />
  </div>
</template>
