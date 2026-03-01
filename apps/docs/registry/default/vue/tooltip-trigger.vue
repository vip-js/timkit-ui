<script setup lang="ts">
import { computed, inject, type Component, type HTMLAttributes } from "vue";
import { cn } from "@timui/core";
import { Primitive } from "./primitive";

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

const context = inject("tooltip") as { api: any } | null;
const triggerProps = computed(() => ({
  ...(context?.api.getTriggerProps?.() ?? {}),
  type: props.asChild ? undefined : "button",
  "data-slot": "tooltip-trigger",
}));
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :class="cn(props.class)"
    :type="props.asChild ? undefined : 'button'"
    v-bind="triggerProps"
  >
    <slot />
  </Primitive>
</template>
