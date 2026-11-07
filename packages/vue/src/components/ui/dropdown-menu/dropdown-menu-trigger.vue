<script setup lang="ts">
import { useDropdownMenuContext } from "./use-dropdown-menu-context";
import { returnFocusKey } from "../use-return-focus";
import { computed, inject, type Component, type HTMLAttributes, type ComputedRef } from "vue";
import { cn } from "@timui/core";
import { Primitive } from '../../primitive';

const props = withDefaults(
  defineProps<{
    as?: string | Component;
    asChild?: boolean;
    class?: HTMLAttributes["class"];
    disabled?: boolean;
  }>(),
  {
    as: "button",
  }
);

type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type DropdownMenuApi = {
  getTriggerProps?: () => Record<string, BindValue>;
};

const api = useDropdownMenuContext() as ComputedRef<DropdownMenuApi> | undefined;
const rememberTrigger = inject(returnFocusKey, () => {});
const groupDisabled = inject<ComputedRef<boolean>>("dropdown-menu-disabled", computed(() => false));
const triggerProps = computed(() => {
  const locked = props.disabled === true || groupDisabled.value;
  const machineProps = api?.value?.getTriggerProps?.() ?? {};
  const onKeyDown = machineProps.onKeyDown as ((event: KeyboardEvent) => void) | undefined;
  const onClick = machineProps.onClick as ((event: MouseEvent) => void) | undefined;
  return {
    type: props.asChild ? undefined : "button",
    ...machineProps,
    "data-slot": "dropdown-menu-trigger",
    onKeyDown(event: KeyboardEvent) {
      if (locked) {
        event.preventDefault();
        return;
      }
      rememberTrigger(event.currentTarget as HTMLElement | null);
      onKeyDown?.(event);
    },
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
