<script setup lang="ts">
import { useSelectContext } from "./use-select-context";
import { useSelectItemsContext } from "./use-select-items-context";
import { computed, onBeforeUnmount, useSlots, watch, type Ref, type VNode } from "vue";
import { CheckIcon } from "lucide-vue-next";
import { cn, selectItemVariants } from "@timui/core";

const props = defineProps<{
  value: string;
  label?: string;
  disabled?: boolean;
  class?: string;
}>();

type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type SelectItem = { label: string; value: string; disabled?: boolean };
type SelectApi = {
  value?: string | string[];
  getItemProps?: (options: { item: SelectItem }) => Record<string, BindValue>;
};

const api = useSelectContext() as Ref<SelectApi | undefined> | undefined;
const itemsContext = useSelectItemsContext();
const slots = useSlots();

const getTextContent = (nodes?: VNode[]): string => {
  if (!nodes) return "";
  return nodes
    .map((node) => {
      if (typeof node.children === "string" || typeof node.children === "number") {
        return String(node.children);
      }
      if (Array.isArray(node.children)) {
        return getTextContent(node.children as VNode[]);
      }
      return "";
    })
    .join("");
};

const itemLabel = computed(() => {
  if (props.label) return props.label;
  const slotText = getTextContent(slots.default?.()).trim();
  return slotText || props.value;
});

const item = computed(() => ({
  label: itemLabel.value,
  value: props.value,
  disabled: props.disabled,
}));
const itemProps = computed(() => api?.value?.getItemProps?.({ item: item.value }) || {});

watch(
  item,
  (next, prev) => {
    if (prev && prev.value !== next.value) {
      itemsContext.unregisterItem(prev.value);
    }
    itemsContext.registerItem(next);
  },
  { immediate: true, deep: true }
);

onBeforeUnmount(() => {
  itemsContext.unregisterItem(props.value);
});

const isSelected = computed(() => {
  const value = api?.value?.value;
  if (Array.isArray(value)) return value.includes(props.value);
  return value === props.value;
});
</script>

<template>
  <div
    v-bind="itemProps"
    :class="
      cn(
        selectItemVariants(),
        props.class
      )
    "
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <CheckIcon v-if="isSelected" class="h-4 w-4" />
    </span>
    <span class="truncate">
      <slot />
    </span>
  </div>
</template>
