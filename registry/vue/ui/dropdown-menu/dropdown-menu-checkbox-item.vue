<script setup lang="ts">
import { inject, type HTMLAttributes, computed } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { dropdownMenuContextKey } from '../../lib/injection-keys'

const dropdownMenuCheckboxItemVariants = cva(
    'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)

const props = defineProps<{
  value: string;
  checked?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();
const api = inject(dropdownMenuContextKey);

const itemProps = computed(() =>
  api?.value?.getOptionItemProps({
    type: "checkbox",
    value: props.value,
    checked: props.checked,
    disabled: props.disabled,
  }) ?? {}
);
const itemState = computed(() =>
  api?.value?.getOptionItemState({
    type: "checkbox",
    value: props.value,
    checked: props.checked,
    disabled: props.disabled,
  }) ?? {}
);
</script>

<template>
  <div v-bind="itemProps" :class="cn(dropdownMenuCheckboxItemVariants(), props.class)">
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
    </span>
    <slot />
  </div>
</template>
