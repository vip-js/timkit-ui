<script setup lang="ts">
import { inject, type HTMLAttributes, computed } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { dropdownMenuContextKey } from '../../lib/injection-keys'

const dropdownMenuRadioItemVariants = cva(
    'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
)

const props = defineProps<{
  value: string;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}>();
const api = inject(dropdownMenuContextKey);

const itemProps = computed(() =>
  api?.value?.getOptionItemProps({
    type: "radio",
    value: props.value,
    disabled: props.disabled,
  }) ?? {}
);
const itemState = computed(() =>
  api?.value?.getOptionItemState({
    type: "radio",
    value: props.value,
    disabled: props.disabled,
  }) ?? {}
);
</script>

<template>
  <div v-bind="itemProps" :class="cn(dropdownMenuRadioItemVariants(), props.class)">
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <svg class="h-2 w-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
    </span>
    <slot />
  </div>
</template>
