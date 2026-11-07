<script setup lang="ts">
import { type HTMLAttributes, computed, inject } from "vue";
import Button from "../button/button.vue";
import { cn } from '@timui/core';
import { PaginationContextKey } from "./pagination-context";

const props = defineProps<{
  page: number;
  class?: HTMLAttributes["class"];
}>();

const context = inject(PaginationContextKey, null);
const isActive = computed(
  () => context?.page.value != null && context.page.value === props.page
);
const itemProps = computed(() => {
  const base = context?.api.value?.getItemProps?.({ type: "page", value: props.page }) ?? {}
  const visible = context?.page.value != null ? base : (() => {
    const { "data-selected": _selected, ...rest } = base as Record<string, unknown>
    return rest
  })()
  return {
    ...visible,
    ...(context?.disabled.value
      ? {
          disabled: true,
          "aria-disabled": "true",
          onClick: (event: Event) => event.preventDefault(),
        }
      : {}),
    "aria-current": isActive.value ? "page" : undefined,
  }
});
</script>

<template>
  <li>
    <Button
      v-bind="itemProps"
      :class="cn(
        'h-9 w-9 p-0',
        isActive ? 'pointer-events-none' : '',
        props.class
      )"
      :variant="isActive ? 'outline' : 'ghost'"
      size="icon"
    >
      <slot />
    </Button>
  </li>
</template>
