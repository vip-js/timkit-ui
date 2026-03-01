<script setup lang="ts">
import { cn, tableRowVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tr :class="cn(tableRowVariants(), props.class)">
    <slot />
  </tr>
</template>
