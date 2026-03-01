<script setup lang="ts">
import { useComboboxContext } from "./use-combobox-context";
import { computed, inject, type ComputedRef } from "vue";
import { cn, comboboxGroupLabelVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ htmlFor: string; class?: HTMLAttributes["class"] }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxApi = {
  getItemGroupLabelProps?: (options: { htmlFor: string }) => Record<string, BindValue>;
};
const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const labelProps = computed(() => api?.value?.getItemGroupLabelProps?.({ htmlFor: props.htmlFor }) ?? {});
</script>

<template>
  <div v-bind="labelProps" data-slot="combobox-group-label" :class="cn(comboboxGroupLabelVariants(), props.class)">
    <slot />
  </div>
</template>
