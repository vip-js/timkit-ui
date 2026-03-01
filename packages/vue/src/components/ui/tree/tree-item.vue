<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { Primitive, type PrimitiveProps } from '../../primitive';
import { cn, treeItemVariants } from '@timui/core';
import { injectTreeContext, provideTreeItemContext, type TreeItemApi } from "./tree-context";

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes["class"];
      item: TreeItemApi;
    }
  >(),
  {
    as: "button",
  }
);

const context = injectTreeContext();
if (!context) {
  throw new Error("TreeItem must be used within a Tree");
}
const { indent } = context;

provideTreeItemContext({
  indent,
  currentItem: props.item,
});

type TreeBindValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, string | number>;

type TreeItemPropsMap = {
  style?: Record<string, string | number>;
  [key: string]: TreeBindValue;
};

const itemProps = computed(() => {
  return typeof props.item.getProps === "function" ? (props.item.getProps() as TreeItemPropsMap) : {};
});

const mergedStyle = computed(() => {
  const level = typeof props.item.getItemMeta === "function" ? props.item.getItemMeta().level : 0;
  const style = itemProps.value.style || {};
  return {
    ...style,
    "--tree-padding": `${level * indent.value}px`,
  };
});

const isFocused = computed(() =>
  typeof props.item.isFocused === "function" ? props.item.isFocused() : false
);
const isFolder = computed(() =>
  typeof props.item.isFolder === "function" ? props.item.isFolder() : false
);
const isSelected = computed(() =>
  typeof props.item.isSelected === "function" ? props.item.isSelected() : false
);
const isDragTarget = computed(() =>
  typeof props.item.isDragTarget === "function"
    ? props.item.isDragTarget()
    : false
);
const isMatchingSearch = computed(() =>
  typeof props.item.isMatchingSearch === "function"
    ? props.item.isMatchingSearch()
    : false
);
const isExpanded = computed(() =>
  typeof props.item.isExpanded === "function" ? props.item.isExpanded() : false
);
</script>

<template>
  <Primitive
    data-slot="tree-item"
    :as="as"
    :as-child="asChild"
    :style="mergedStyle"
    :class="
      cn(
        treeItemVariants(),
        props.class
      )
    "
    :data-focus="isFocused || undefined"
    :data-folder="isFolder || undefined"
    :data-selected="isSelected || undefined"
    :data-drag-target="isDragTarget || undefined"
    :data-search-match="isMatchingSearch || undefined"
    :aria-expanded="isExpanded"
    v-bind="itemProps"
  >
    <slot />
  </Primitive>
</template>
