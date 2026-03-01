<script setup lang="ts">
import { cn, tableCaptionVariants } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <caption :class="cn(tableCaptionVariants(), props.class)">
    <slot />
  </caption>
</template>
