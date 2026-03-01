<script setup lang="ts">
import { type HTMLAttributes, computed, toRef } from "vue";
import { cn } from "@/lib/utils";
import { provideTreeContext } from "./tree-context";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    indent?: number;
    tree?: any;
  }>(),
  {
    indent: 20,
  }
);

provideTreeContext({
  indent: toRef(props, "indent"),
  tree: props.tree,
});

const containerProps = computed(() => {
  return props.tree && typeof props.tree.getContainerProps === "function"
    ? props.tree.getContainerProps()
    : {};
});

const mergedStyle = computed(() => {
  return {
    ...containerProps.value.style,
    "--tree-indent": `${props.indent}px`,
  };
});
</script>

<template>
  <div
    data-slot="tree"
    :style="mergedStyle"
    :class="cn('flex flex-col', props.class)"
    v-bind="containerProps"
  >
    <slot />
  </div>
</template>
