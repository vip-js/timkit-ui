<script setup lang="ts">
import { useComboboxContext } from "./use-combobox-context";
import { computed, inject, type ComputedRef } from "vue";
import { cn, comboboxListVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxApi = {
  getListProps?: () => Record<string, BindValue>;
};
const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const listProps = computed(() => api?.value?.getListProps?.() ?? {});
</script>

<template>
  <div v-bind="listProps" data-slot="combobox-list" :class="cn(comboboxListVariants(), props.class)">
    <slot />
  </div>
</template>
