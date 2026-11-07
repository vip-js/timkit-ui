<script setup lang="ts">
import { computed, inject, type Component, type HTMLAttributes } from "vue";
import { cn } from "@timui/core";
import { Primitive } from '../../primitive';
import { PopoverDisabledKey, usePopoverContext } from "./use-popover-context";
import { returnFocusKey } from "../use-return-focus";

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

const context = usePopoverContext();
const disabled = inject(PopoverDisabledKey, computed(() => false));
const rememberTrigger = inject(returnFocusKey, () => {});
const triggerProps = computed(() => {
  const raw = context.value.getTriggerProps?.() ?? {};
  return {
    ...raw,
    type: props.asChild ? undefined : "button",
    "data-slot": "popover-trigger",
    disabled: disabled.value || undefined,
    "aria-disabled": disabled.value || undefined,
    onClick(event: Event) {
      if (disabled.value) return;
      rememberTrigger((event.currentTarget as HTMLElement | null) ?? (event.target as HTMLElement | null));
      raw.onClick?.(event as PointerEvent);
    },
  };
});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
    v-bind="triggerProps"
  >
    <slot />
  </Primitive>
</template>
