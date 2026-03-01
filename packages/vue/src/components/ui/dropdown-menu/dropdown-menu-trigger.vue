<script setup lang="ts">
import { useDropdownMenuContext } from "./use-dropdown-menu-context";
import { computed, inject, type Component, type HTMLAttributes, type ComputedRef } from "vue";
import { cn } from "@timui/core";
import { Primitive } from '../../primitive';

const props = withDefaults(
  defineProps<{
    as?: string | Component;
    asChild?: boolean;
    class?: HTMLAttributes["class"];
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
const triggerProps = computed(() => ({
  type: props.asChild ? undefined : "button",
  "data-slot": "dropdown-menu-trigger",
  ...(api?.value?.getTriggerProps?.() ?? {}),
}));
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
