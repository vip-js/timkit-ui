<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, type ComputedRef } from "vue";
import { useCommandContext } from "./use-command-context";
import { cn, commandItemVariants } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  value: string;
  label?: string;
  class?: HTMLAttributes["class"];
}>();

const context = useCommandContext();
const item = computed(() => ({
  label: props.label ?? props.value,
  value: props.value,
}));

onMounted(() => {
  context?.registerItem?.(item.value);
});

onBeforeUnmount(() => {
  context?.unregisterItem?.(props.value);
});
</script>

<template>
  <div
    v-bind="context?.api.value?.getItemProps?.({ item })"
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
