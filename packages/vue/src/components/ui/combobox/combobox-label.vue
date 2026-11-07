<script setup lang="ts">
import { useComboboxContext, useComboboxLabelPresence } from "./use-combobox-context";
import { computed, inject, onMounted, onUnmounted, type ComputedRef } from "vue";
import { cn, comboboxLabelVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxApi = {
  getLabelProps?: () => Record<string, BindValue>;
};
const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const labelled = useComboboxLabelPresence();
const labelProps = computed(() => api?.value?.getLabelProps?.() ?? {});

onMounted(() => {
  if (labelled) labelled.value = true;
});
onUnmounted(() => {
  if (labelled) labelled.value = false;
});
</script>

<template>
  <label v-bind="labelProps" data-slot="combobox-label" :class="cn(comboboxLabelVariants(), props.class)">
    <slot />
  </label>
</template>
