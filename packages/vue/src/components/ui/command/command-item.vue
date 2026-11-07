<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, type ComputedRef } from "vue";
import { commandMatches } from "./use-command";
import { useCommandContext } from "./use-command-context";
import { cn, commandItemVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  value: string;
  label?: string;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
  onSelect?: (value: string) => void;
}>();

const emit = defineEmits<{
  (e: "select", value: string): void;
}>();

const context = useCommandContext();
const item = computed(() => ({
  label: props.label ?? props.value,
  value: props.value,
  disabled: props.disabled === true,
}));

onMounted(() => {
  context?.registerItem?.(item.value);
});

onBeforeUnmount(() => {
  context?.unregisterItem?.(props.value);
});

const visible = computed(() => commandMatches(item.value, context.query.value));
const itemProps = computed(() => {
  const machineProps = context.api.value.getItemProps?.({ item: item.value }) ?? {};
  const machineKeydown = machineProps.onKeydown as ((event: KeyboardEvent) => void) | undefined;
  const select = () => {
    if (props.disabled || context.disabled.value) return;
    context.choose(props.value);
    emit("select", props.value);
  };
  return {
    ...machineProps,
    "data-slot": "command-item",
    "data-state": context.selected.value === props.value ? "checked" : "unchecked",
    onClick: () => {
      select();
    },
    onKeydown: (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        select();
        return;
      }
      machineKeydown?.(event);
    },
  };
});
</script>

<template>
  <div
    v-bind="itemProps"
    :hidden="visible ? undefined : true"
    :class="
      cn(
        commandItemVariants(),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
