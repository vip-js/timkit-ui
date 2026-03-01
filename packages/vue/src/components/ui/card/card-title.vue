<script setup lang="ts">
import { cn, cardTitleVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <h3 :class="cn(cardTitleVariants(), props.class)">
    <slot />
  </h3>
</template>
