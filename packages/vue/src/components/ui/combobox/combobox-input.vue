<script setup lang="ts">
import { useComboboxContext, useComboboxLabelPresence } from "./use-combobox-context";
import { computed, inject, useAttrs, type ComputedRef } from "vue";
import { cn, comboboxInputVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"]; placeholder?: string }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxApi = {
  getInputProps?: () => Record<string, BindValue>;
};
const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const attrs = useAttrs();
const labelled = useComboboxLabelPresence();
const inputProps = computed(() => api?.value?.getInputProps?.() ?? {});
const inputLabel = computed(() => {
  const passed = attrs["aria-label"];
  const labelledBy = attrs["aria-labelledby"];
  const fromApi = inputProps.value["aria-label"] || inputProps.value["aria-labelledby"];
  if ((typeof passed === "string" && passed) || labelledBy || fromApi || labelled?.value) return undefined;
  return props.placeholder || (typeof inputProps.value.placeholder === "string" ? inputProps.value.placeholder : "") || "Choose an item";
});
</script>

<template>
  <input
    v-bind="inputProps"
    data-slot="combobox-input"
    :placeholder="props.placeholder"
    :aria-label="inputLabel"
    :class="cn(comboboxInputVariants(), props.class)"
  />
</template>
