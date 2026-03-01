<script setup lang="ts">
import { cn, tableVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div class="relative w-full overflow-auto">
    <table :class="cn(tableVariants(), props.class)">
      <slot />
    </table>
  </div>
</template>
