<script setup lang="ts">
import { cn, tableCellVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <td data-slot="table-cell" :class="cn(tableCellVariants(), props.class)">
    <slot />
  </td>
</template>
