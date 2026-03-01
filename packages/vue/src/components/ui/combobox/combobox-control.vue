<script setup lang="ts">
import { useComboboxContext } from "./use-combobox-context";
import { computed, inject, type ComputedRef } from "vue";
import { cn, comboboxControlVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxApi = {
  getControlProps?: () => Record<string, BindValue>;
};
const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const controlProps = computed(() => api?.value?.getControlProps?.() ?? {});
</script>

<template>
  <div v-bind="controlProps" data-slot="combobox-control" :class="cn(comboboxControlVariants(), props.class)">
    <slot />
  </div>
</template>
