<script setup lang="ts">
import { cn, cardContentVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div :class="cn(cardContentVariants(), props.class)">
    <slot />
  </div>
</template>
