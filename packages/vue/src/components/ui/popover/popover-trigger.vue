<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from "vue";
import { cn } from "@timui/core";
import { Primitive } from '../../primitive';
import { usePopoverContext } from "./use-popover-context";

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
const triggerProps = computed(() => ({
  ...(context.value.getTriggerProps?.() ?? {}),
  type: props.asChild ? undefined : "button",
  "data-slot": "popover-trigger",
}));
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
