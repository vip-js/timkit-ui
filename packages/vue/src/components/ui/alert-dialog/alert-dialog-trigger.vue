<script setup lang="ts">
import { computed, inject, type HTMLAttributes, type Component } from "vue";
import { cn } from "@timui/core";
import { Primitive } from '../../primitive';
import { useAlertDialogContext } from "./use-alert-dialog-context";
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

const api = useAlertDialogContext();
const rememberTrigger = inject(returnFocusKey, () => {});
const triggerProps = computed(() => {
  const trigger = api.value.getTriggerProps();
  const onClick = trigger.onClick as ((event: MouseEvent) => void) | undefined;
  return {
    ...trigger,
    disabled: api.value.disabled || undefined,
    onClick(event: MouseEvent) {
      if (api.value.disabled) return;
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
    data-slot="alert-dialog-trigger"
    :class="cn(props.class)"
  >
    <slot />
  </Primitive>
</template>
