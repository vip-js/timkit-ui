<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn, dialogFooterVariants } from "@timui/shared";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(dialogFooterVariants(), props.class)">
    <slot />
  </div>
</template>
