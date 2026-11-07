<script setup lang="ts">
import { computed, inject, type Component, type ComputedRef, type HTMLAttributes } from "vue";
import { cn } from "@timui/core";
import { Primitive } from '../../primitive';
import { useSheetContext } from "./use-sheet-context";
import { returnFocusKey } from "../use-return-focus";

const props = withDefaults(
  defineProps<{
    as?: string | Component;
    asChild?: boolean;
    disabled?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    as: "button",
  }
);

const api = useSheetContext();
const rememberTrigger = inject(returnFocusKey, () => {});
const groupDisabled = inject<ComputedRef<boolean>>("sheet-disabled", computed(() => false));
const triggerProps = computed(() => {
  const locked = props.disabled === true || groupDisabled.value;
  const machineProps = api.value.getTriggerProps();
  const onClick = machineProps.onClick as ((event: MouseEvent) => void) | undefined;
  return {
    ...machineProps,
    "data-slot": "sheet-trigger",
    disabled: locked || undefined,
    "aria-disabled": locked || undefined,
    onClick(event: MouseEvent) {
      if (locked) return;
      rememberTrigger(event.currentTarget as HTMLElement | null);
      onClick?.(event);
    },
  };
});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="triggerProps"
    :class="cn(props.class)"
  >
    <slot />
  </Primitive>
</template>
