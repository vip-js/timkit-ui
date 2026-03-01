<script setup lang="ts">
import { cn, tableBodyVariants } from "@/lib/utils";
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
