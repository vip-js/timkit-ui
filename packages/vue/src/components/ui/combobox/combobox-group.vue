<script setup lang="ts">
import { useComboboxContext } from "./use-combobox-context";
import { computed, inject, type ComputedRef } from "vue";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ id: string; class?: HTMLAttributes["class"] }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxApi = {
  getItemGroupProps?: (options: { id: string }) => Record<string, BindValue>;
};
const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const groupProps = computed(() => api?.value?.getItemGroupProps?.({ id: props.id }) ?? {});
</script>

<template>
  <div v-bind="groupProps" data-slot="combobox-group" :class="props.class">
    <slot />
  </div>
</template>
