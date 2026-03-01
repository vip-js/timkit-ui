<script setup lang="ts">
import { useComboboxContext } from "./use-combobox-context";
import { computed, inject, type ComputedRef } from "vue";
import { cn, comboboxItemIndicatorVariants, comboboxItemTextVariants, comboboxItemVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

type ComboboxItem = {
  value: string;
  label?: string;
  disabled?: boolean;
  [key: string]: string | number | boolean | null | undefined | object;
};
const props = defineProps<{
  item: ComboboxItem;
  class?: HTMLAttributes["class"];
}>();

type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxItemState = { highlighted?: boolean; selected?: boolean };
type ComboboxApi = {
  getItemProps?: (options: { item: ComboboxItem }) => Record<string, BindValue>;
  getItemTextProps?: (options: { item: ComboboxItem }) => Record<string, BindValue>;
  getItemIndicatorProps?: (options: { item: ComboboxItem }) => Record<string, BindValue>;
  getItemState?: (options: { item: ComboboxItem }) => ComboboxItemState | undefined;
};

const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const itemProps = computed(() => api?.value?.getItemProps?.({ item: props.item }) ?? {});
const itemTextProps = computed(() => api?.value?.getItemTextProps?.({ item: props.item }) ?? {});
const itemIndicatorProps = computed(() => api?.value?.getItemIndicatorProps?.({ item: props.item }) ?? {});
const itemState = computed(() => api?.value?.getItemState?.({ item: props.item }));
</script>

<template>
  <div
    v-bind="itemProps"
    data-slot="combobox-item"
    :data-highlighted="itemState?.highlighted || undefined"
    :data-selected="itemState?.selected || undefined"
    :class="cn(comboboxItemVariants(), props.class)"
  >
    <span v-bind="itemIndicatorProps" :class="comboboxItemIndicatorVariants()">
      <span v-if="itemState?.selected">✓</span>
    </span>
    <span v-bind="itemTextProps" :class="comboboxItemTextVariants()">
      <slot>{{ props.item.value }}</slot>
    </span>
  </div>
</template>
