<script setup lang="ts">
import { computed, inject, type Component, type HTMLAttributes } from "vue";
import { cn, tabsTriggerVariants } from "@timui/core";
import { Primitive } from '../../primitive';
import { useTabsContext } from "./use-tabs-context";

const props = defineProps<{
  value: string;
  as?: string | Component;
  asChild?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();

const api = useTabsContext();
const triggerProps = computed(() =>
  api.value.getTriggerProps?.({ value: props.value, disabled: props.disabled }) ?? {},
);
const isSelected = computed(() => api.value.value === props.value);
</script>

<template>
  <Primitive
    :as="props.as || 'button'"
    :as-child="props.asChild"
    :type="props.asChild ? undefined : 'button'"
    v-bind="triggerProps"
    data-slot="tabs-trigger"
    :data-state="isSelected ? 'active' : 'inactive'"
    :class="
      cn(tabsTriggerVariants(), props.class)
    "
  >
    <slot />
  </Primitive>
</template>
