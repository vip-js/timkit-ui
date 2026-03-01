<script setup lang="ts">
import { useComboboxContext } from "./use-combobox-context";
import { computed, inject, type ComputedRef } from "vue";
import { cn, comboboxInputVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxApi = {
  getInputProps?: () => Record<string, BindValue>;
};
const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const inputProps = computed(() => api?.value?.getInputProps?.() ?? {});
</script>

<template>
  <input v-bind="inputProps" data-slot="combobox-input" :class="cn(comboboxInputVariants(), props.class)" />
</template>
