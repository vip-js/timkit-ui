<script setup lang="ts">
import { useSelectContext } from "./use-select-context";
import { computed, inject, type Ref } from "vue";
import { CheckIcon } from "lucide-vue-next";
import { cn, selectItemVariants } from "@timui/core";

const props = defineProps<{
  value: string;
  label?: string;
  class?: string;
}>();

type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type SelectItem = { label: string; value: string };
type SelectApi = {
  value?: string | string[];
  getItemProps?: (options: { item: SelectItem }) => Record<string, BindValue>;
};

const api = useSelectContext() as Ref<SelectApi | undefined> | undefined;
const item = computed(() => ({
  label: props.label ?? props.value,
  value: props.value,
}));

const isSelected = computed(() => {
  const value = api?.value?.value;
  if (Array.isArray(value)) return value.includes(props.value);
  return value === props.value;
});
</script>

<template>
  <div
    v-bind="api?.getItemProps?.({ item })"
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
