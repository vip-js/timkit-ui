<script setup lang="ts">
import { computed, inject, type ComputedRef } from "vue";
import { useDialogContext } from "./use-dialog-context";
import { returnFocusKey } from "../use-return-focus";

const props = defineProps<{ disabled?: boolean }>();
const api = useDialogContext();
const rememberTrigger = inject(returnFocusKey, () => {});
const groupDisabled = inject<ComputedRef<boolean>>("dialog-disabled", computed(() => false));
const triggerProps = computed(() => {
  const locked = props.disabled === true || groupDisabled.value;
  const trigger = api.value.getTriggerProps();
  const onClick = trigger.onClick as ((event: MouseEvent) => void) | undefined;
  return {
    ...trigger,
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
  <button v-bind="triggerProps" data-slot="dialog-trigger">
    <slot />
  </button>
</template>
