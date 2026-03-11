<script setup lang="ts">
import { cn, tableCaptionVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <caption data-slot="table-caption" :class="cn(tableCaptionVariants(), props.class)">
    <slot />
  </caption>
</template>
