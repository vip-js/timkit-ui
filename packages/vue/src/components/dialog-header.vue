<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn, dialogHeaderVariants } from "@timui/shared";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div :class="cn(dialogHeaderVariants(), props.class)">
    <slot />
  </div>
</template>
