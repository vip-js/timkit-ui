<script setup lang="ts">
import { cn, tableFooterVariants } from "@timui/core";
import { type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <tfoot data-slot="table-footer" :class="cn(tableFooterVariants(), props.class)">
    <slot />
  </tfoot>
</template>
