<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useSlots, watch, type VNode } from "vue";
import { CheckIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{
  value: string;
  label?: string;
  class?: string;
}>();

const api = inject("select") as any;
const selectItems = inject("selectItems") as
  | {
      registerItem: (item: { label: string; value: string; disabled?: boolean }) => void;
      unregisterItem: (value: string) => void;
    }
  | undefined;
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
}));

watch(
  item,
  (next, prev) => {
    if (prev && prev.value !== next.value) {
      selectItems?.unregisterItem(prev.value);
    }
    selectItems?.registerItem(next);
  },
  { immediate: true, deep: true }
);

onBeforeUnmount(() => {
  selectItems?.unregisterItem(props.value);
});

const isSelected = computed(() => {
  const value = api.value?.value;
  if (Array.isArray(value)) return value.includes(props.value);
  return value === props.value;
});
</script>

<template>
  <div
    v-bind="api.value?.getItemProps({ item: item.value })"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
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
