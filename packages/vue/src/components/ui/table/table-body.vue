<script setup lang="ts">
import { cn, tableBodyVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tbody :class="cn(tableBodyVariants(), props.class)">
    <slot />
  </tbody>
</template>
