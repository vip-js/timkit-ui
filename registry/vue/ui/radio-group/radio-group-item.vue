<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { radioGroupContextKey } from '../../lib/injection-keys'

const radioGroupItemVariants = cva(
    'border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
)
const radioGroupIndicatorVariants = cva('flex items-center justify-center')
const radioGroupIndicatorIconVariants = cva('h-2.5 w-2.5 fill-current text-current')

const props = defineProps<{ value: string; class?: HTMLAttributes["class"]; disabled?: boolean }>();
const api = inject(radioGroupContextKey);

const itemState = computed(() =>
  api?.value?.getItemState?.({ value: props.value, disabled: props.disabled })
);
const itemProps = computed(() =>
  api?.value?.getItemProps?.({ value: props.value, disabled: props.disabled }) ?? {}
);
const controlProps = computed(() =>
  api?.value?.getItemControlProps?.({ value: props.value, disabled: props.disabled }) ?? {}
);
const hiddenInputProps = computed(() =>
  api?.value?.getItemHiddenInputProps?.({ value: props.value, disabled: props.disabled }) ?? {}
);
</script>

<template>
  <label v-bind="itemProps" data-slot="radio-group-item">
    <div
      v-bind="controlProps"
      data-slot="radio-control"
      :class="cn(radioGroupItemVariants(), controlProps.class, props.class)"
    >
      <span data-slot="radio-indicator" :class="radioGroupIndicatorVariants()">
        <svg class="radioGroupIndicatorIconVariants()" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
      </span>
    </div>
    <input v-bind="hiddenInputProps" />
  </label>
</template>
