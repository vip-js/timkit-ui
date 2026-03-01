<script setup lang="ts">
import { cn, tableHeaderVariants } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <thead :class="cn(tableHeaderVariants(), props.class)">
    <slot />
  </thead>
</template>
