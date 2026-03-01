<script setup lang="ts">
import { computed, getCurrentInstance, inject, type Component, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Primitive } from "./primitive";

const props = withDefaults(
  defineProps<{
    as?: string | Component;
    asChild?: boolean;
    class?: HTMLAttributes["class"];
    inset?: boolean;
    value?: string;
    disabled?: boolean;
    closeOnSelect?: boolean;
  }>(),
  {
    as: "div",
  }
);

const api = inject("dropdown-menu") as any;
const instance = getCurrentInstance();
const itemValue = computed(() => props.value || `dropdown-item-${instance?.uid ?? 0}`);
const itemProps = computed(() => {
  if (!api?.value) return {};
  return api.value.getItemProps({
    value: itemValue.value,
    disabled: props.disabled,
    closeOnSelect: props.closeOnSelect,
  });
});
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    v-bind="itemProps"
    data-slot="dropdown-menu-item"
    :class="
      cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
        props.inset && 'pl-8',
        props.class
      )
    "
  >
    <slot />
  </Primitive>
</template>
