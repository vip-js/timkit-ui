<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import type * as combobox from "@zag-js/combobox";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { comboboxContextKey } from '../../lib/injection-keys'

const comboboxItemVariants = cva(
    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)
const comboboxItemIndicatorVariants = cva(
    'absolute left-2 flex h-3.5 w-3.5 items-center justify-center'
)
const comboboxItemTextVariants = cva('ps-6')

const props = defineProps<{ class?: HTMLAttributes['class']; item: combobox.Item }>();
const api = inject(comboboxContextKey);

const itemState = computed(() => api.value.getItemState({ item: props.item }));
</script>

<template>
  <li v-bind="api.getItemProps({ item: props.item })" :class="cn(comboboxItemVariants(), props.class)">
    <span :class="comboboxItemIndicatorVariants()" v-if="itemState.selected">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
    <span :class="comboboxItemTextVariants()">
      <slot>{{ item.label }}</slot>
    </span>
  </li>
</template>
