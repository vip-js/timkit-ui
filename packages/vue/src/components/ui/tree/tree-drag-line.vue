<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn, treeDragLineVariants } from '@timui/core';
import { injectTreeContext } from "./tree-context";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const context = injectTreeContext();
const tree = context?.tree;

const dragLineStyle = computed(() => {
  if (tree && typeof tree.getDragLineStyle === "function") {
    return tree.getDragLineStyle();
  }
  return {};
});
</script>

<template>
  <div
    v-if="tree && tree.getDragLineStyle"
    :style="dragLineStyle"
    :class="
      cn(
        treeDragLineVariants(),
        props.class
      )
    "
  />
</template>
