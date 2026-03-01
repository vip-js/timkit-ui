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
const itemProps = computed(() =>
  context?.api.value?.getItemProps?.({ type: "page", value: props.page }) ?? {}
);
const isActive = computed(() => context?.api.value?.page === props.page);
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
