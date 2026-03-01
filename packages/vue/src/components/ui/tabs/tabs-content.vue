<script setup lang="ts">
import { computed, inject } from "vue";
import { cn, tabsContentVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";
import { useTabsContext } from "./use-tabs-context";

const props = defineProps<{ value: string; class?: HTMLAttributes["class"] }>();
const api = useTabsContext();
const isSelected = computed(() => api.value.value === props.value);
const contentProps = computed(() =>
  api.value.getContentProps?.({ value: props.value }) ?? {},
);
</script>

<template>
  <div
    v-if="isSelected"
    v-bind="contentProps"
    data-slot="tabs-content"
    :data-state="isSelected ? 'active' : 'inactive'"
    :class="
      cn(tabsContentVariants(), props.class)
    "
  >
    <slot />
  </div>
</template>
