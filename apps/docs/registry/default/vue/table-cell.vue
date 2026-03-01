<script setup lang="ts">
import { cn, tableCellVariants } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <td :class="cn(tableCellVariants(), props.class)">
    <slot />
  </td>
</template>
