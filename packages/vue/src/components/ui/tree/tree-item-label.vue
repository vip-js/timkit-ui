<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { cn, treeItemLabelIconVariants, treeItemLabelVariants } from '@timui/core';
import { injectTreeItemContext, type TreeItemApi } from "./tree-context";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  item?: TreeItemApi;
}>();

const context = injectTreeItemContext();

const item = computed(() => props.item || context?.currentItem);

const isFolder = computed(() =>
  item.value && typeof item.value.isFolder === "function"
    ? item.value.isFolder()
    : false
);
const itemName = computed(() =>
  item.value && typeof item.value.getItemName === "function"
    ? item.value.getItemName()
    : null
);
</script>

<template>
  <span
    v-if="item"
    data-slot="tree-item-label"
    :class="
      cn(
        treeItemLabelVariants(),
        props.class
      )
    "
  >
    <template v-if="isFolder">
      <ChevronDown
        :class="treeItemLabelIconVariants()"
      />
    </template>
    <slot>
      {{ itemName }}
    </slot>
  </span>
</template>
