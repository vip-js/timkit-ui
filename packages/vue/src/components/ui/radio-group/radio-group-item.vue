<script setup lang="ts">
import { computed, inject, type ComputedRef } from "vue";
import {
  cn,
  radioGroupIndicatorIconVariants,
  radioGroupIndicatorVariants,
  radioGroupItemVariants,
} from "@timui/core";
import type { RadioGroupApi } from "@timui/core";
import { Circle } from "lucide-vue-next";
import { useRadioGroupContext } from "./use-radio-group-context";

const props = defineProps<{ value: string; class?: string; disabled?: boolean }>();
const api = useRadioGroupContext();
inject<((value: string) => void) | null>("radio-register", null)?.(props.value);

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
        <Circle
          v-if="itemState?.checked"
          aria-hidden="true"
          :class="radioGroupIndicatorIconVariants()"
        />
      </span>
    </div>
    <input v-bind="hiddenInputProps" />
    <slot />
  </label>
</template>
