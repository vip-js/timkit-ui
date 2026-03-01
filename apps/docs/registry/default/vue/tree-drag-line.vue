<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { cn } from "@/lib/utils";
import { injectTreeContext } from "./tree-context";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

const { tree } = injectTreeContext("TreeDragLine");

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
        'bg-primary before:bg-background before:border-primary absolute z-30 -mt-px h-0.5 w-[unset] before:absolute before:-top-[3px] before:left-0 before:size-2 before:rounded-full before:border-2',
        props.class
      )
    "
  />
</template>
