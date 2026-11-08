<script setup lang="ts">
import { computed, inject, type Component, type ComputedRef, type HTMLAttributes } from "vue";
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
inject<((value: string) => void) | null>("tabs-register", null)?.(props.value);
const groupDisabled = inject<ComputedRef<boolean>>("tabs-disabled", computed(() => false));
const onKeyDown = (event: KeyboardEvent) => {
  if (groupDisabled.value) {
    event.preventDefault();
    return;
  }
  const list = event.currentTarget instanceof HTMLElement ? event.currentTarget.closest('[data-slot="tabs-list"]') : null;
  if (!list) return;
  const horizontal = list.getAttribute("data-orientation") !== "vertical";
  const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
  const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
  if (event.key !== nextKey && event.key !== prevKey) return;
  const triggers = [...list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])')];
  const current = triggers.indexOf(event.currentTarget as HTMLElement);
  if (current < 0 || triggers.length === 0) return;
  const delta = event.key === nextKey ? 1 : -1;
  const value = triggers[(current + delta + triggers.length) % triggers.length]?.dataset.value;
  if (value) {
    event.preventDefault();
    api.value.setValue?.(value);
  }
};
const triggerProps = computed(() => {
  const locked = groupDisabled.value || props.disabled === true;
  const next = api.value.getTriggerProps?.({ value: props.value, disabled: locked }) ?? {};
  if (!groupDisabled.value) return next;
  return {
    ...next,
    disabled: true,
    "aria-disabled": "true",
    onClick: (event: Event) => event.preventDefault(),
  };
});
const isSelected = computed(() => api.value.value === props.value);
</script>

<template>
  <Primitive
    :as="props.as || 'button'"
    :as-child="props.asChild"
    :type="props.asChild ? undefined : 'button'"
    v-bind="triggerProps"
    @keydown="onKeyDown"
    data-slot="tabs-trigger"
    :data-state="isSelected ? 'active' : 'inactive'"
    :class="
      cn(tabsTriggerVariants(), props.class)
    "
  >
    <slot />
  </Primitive>
</template>
