<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { Primitive, type PrimitiveProps } from "./primitive";
import { cn } from "@/lib/utils";
import { injectTreeContext, provideTreeItemContext } from "./tree-context";

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      class?: HTMLAttributes["class"];
      item: any; // ItemInstance<T>
    }
  >(),
  {
    as: "button",
  }
);

const { indent } = injectTreeContext("TreeItem");

provideTreeItemContext({
  indent,
  currentItem: props.item,
});

const itemProps = computed(() => {
  return typeof props.item.getProps === "function" ? props.item.getProps() : {};
});

const mergedStyle = computed(() => {
  const level = props.item.getItemMeta().level;
  return {
    ...itemProps.value.style,
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
const isExpanded = computed(() => props.item.isExpanded());
</script>

<template>
  <Primitive
    data-slot="tree-item"
    :as="as"
    :as-child="asChild"
    :style="mergedStyle"
    :class="
      cn(
        'z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
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
