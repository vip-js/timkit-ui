<script setup lang="ts">
import { useSelectContext } from "./use-select-context";
import { returnFocusKey } from "../use-return-focus";
import { computed, inject, useAttrs, type Component, type HTMLAttributes, type Ref } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";
import { cn, selectTriggerIconVariants, selectTriggerVariants } from "@timui/core";
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
type SelectApi = {
  getTriggerProps?: () => Record<string, BindValue>;
};

const api = useSelectContext() as Ref<SelectApi | undefined> | undefined;
const attrs = useAttrs();
const rememberTrigger = inject(returnFocusKey, () => {});
const triggerProps = computed(() => {
  const machineProps = api?.value?.getTriggerProps?.() || {};
  const onKeyDown = machineProps.onKeyDown as ((event: KeyboardEvent) => void) | undefined;
  const onClick = machineProps.onClick as ((event: MouseEvent) => void) | undefined;
  return {
    ...machineProps,
    "data-slot": "select-trigger",
    onKeyDown(event: KeyboardEvent) {
      rememberTrigger(event.currentTarget as HTMLElement | null);
      onKeyDown?.(event);
    },
    onClick(event: MouseEvent) {
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
    :aria-label="attrs['aria-label']"
    :class="
      cn(
        !props.asChild && selectTriggerVariants(),
        props.class
      )
    "
  >
    <slot />
    <ChevronDownIcon v-if="!props.asChild" aria-hidden="true" :class="selectTriggerIconVariants()" />
  </Primitive>
</template>
