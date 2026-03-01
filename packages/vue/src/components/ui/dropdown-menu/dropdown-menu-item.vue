<script setup lang="ts">
import { useDropdownMenuContext } from "./use-dropdown-menu-context";
import { computed, getCurrentInstance, inject, type Component, type HTMLAttributes, type ComputedRef } from "vue";
import { cn, dropdownMenuItemVariants } from "@timui/core";
import { Primitive } from '../../primitive';

const props = withDefaults(
  defineProps<{
    as?: string | Component;
    asChild?: boolean;
    class?: HTMLAttributes["class"];
    inset?: boolean;
    value?: string;
    disabled?: boolean;
    closeOnSelect?: boolean;
  }>(),
  {
    as: "div",
  }
);

type BindValue = string | number | boolean | null | undefined | ((...args: never[]) => void);
type DropdownMenuApi = {
  getItemProps?: (options: {
    value: string;
    disabled?: boolean;
    closeOnSelect?: boolean;
  }) => Record<string, BindValue>;
};

const api = useDropdownMenuContext() as ComputedRef<DropdownMenuApi> | undefined;
const instance = getCurrentInstance();
const itemValue = computed(() => props.value || `dropdown-item-${instance?.uid ?? 0}`);
const itemProps = computed(() => {
  if (!api?.value) return {};
  return api.value.getItemProps?.({
    value: itemValue.value,
    disabled: props.disabled,
    closeOnSelect: props.closeOnSelect,
  }) ?? {};
});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="itemProps"
    data-slot="dropdown-menu-item"
    :class="
      cn(
        dropdownMenuItemVariants(),
        props.inset && 'pl-8',
        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
