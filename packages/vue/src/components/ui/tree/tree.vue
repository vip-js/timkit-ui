<script setup lang="ts">
import { type HTMLAttributes, computed, toRef } from "vue";
import { cn, treeVariants } from '@timui/core';
import { provideTreeContext, type TreeApi } from "./tree-context";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    indent?: number;
    tree?: TreeApi;
  }>(),
  {
    indent: 20,
  }
);

type TreeBindValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, string | number>;

type TreeContainerProps = {
  style?: Record<string, string | number>;
  [key: string]: TreeBindValue;
};

provideTreeContext({
  indent: toRef(props, "indent"),
  tree: props.tree,
});

const containerProps = computed<TreeContainerProps>(() => {
  return props.tree && typeof props.tree.getContainerProps === "function"
    ? (props.tree.getContainerProps() as TreeContainerProps)
    : {};
});

const mergedStyle = computed(() => {
  const style = containerProps.value.style || {};
  return {
    ...style,
    "--tree-indent": `${props.indent}px`,
  };
});
</script>

<template>
  <div
    data-slot="tree"
    :style="mergedStyle"
    :class="cn(treeVariants(), props.class)"
    v-bind="containerProps"
  >
    <slot />
  </div>
</template>
