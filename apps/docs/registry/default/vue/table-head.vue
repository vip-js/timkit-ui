<script setup lang="ts">
import { cn, tableHeadVariants } from "@/lib/utils";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <th :class="cn(tableHeadVariants(), props.class)">
    <slot />
  </th>
</template>
