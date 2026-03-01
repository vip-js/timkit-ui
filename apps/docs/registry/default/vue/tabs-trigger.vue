<script setup lang="ts">
import { computed, inject, type Component, type HTMLAttributes } from "vue";
import { cn } from "@timui/core";
import { Primitive } from "./primitive";

const props = defineProps<{
  value: string;
  as?: string | Component;
  asChild?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();

const context = inject("tabs") as { api: any } | null;
const triggerProps = computed(() =>
  context?.api.getTriggerProps?.({ value: props.value, disabled: props.disabled }) ?? {},
);
const isSelected = computed(() => context?.api.value === props.value);
</script>

<template>
  <Primitive
    :as="props.as || 'button'"
    :as-child="props.asChild"
    :type="props.asChild ? undefined : 'button'"
    v-bind="triggerProps"
    data-slot="tabs-trigger"
    :data-state="isSelected ? 'active' : 'inactive'"
    :class="
      cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
