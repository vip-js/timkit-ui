<script setup lang="ts">
import { computed, inject, type Component, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
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

const api = inject("dropdown-menu") as any;
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
