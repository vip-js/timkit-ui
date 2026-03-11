<script setup lang="ts">
import { cn, tableHeaderVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <thead data-slot="table-header" :class="cn(tableHeaderVariants(), props.class)">
    <slot />
  </thead>
</template>
