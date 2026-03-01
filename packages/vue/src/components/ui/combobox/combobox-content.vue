<script setup lang="ts">
import { useComboboxContext } from "./use-combobox-context";
import { computed, inject, type ComputedRef } from "vue";
import { cn, comboboxContentVariants, comboboxPositionerVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type ComboboxApi = {
  open?: boolean;
  getPositionerProps?: () => Record<string, BindValue>;
  getContentProps?: () => Record<string, BindValue>;
};
const api = useComboboxContext() as ComputedRef<ComboboxApi> | undefined;
const open = computed(() => api?.value?.open);
const positionerProps = computed(() => api?.value?.getPositionerProps?.() ?? {});
const contentProps = computed(() => api?.value?.getContentProps?.() ?? {});
</script>

<template>
  <div v-if="open" v-bind="positionerProps" data-slot="combobox-positioner" :class="comboboxPositionerVariants()">
    <div v-bind="contentProps" data-slot="combobox-content" :class="cn(comboboxContentVariants(), props.class)">
      <slot />
    </div>
  </div>
</template>
