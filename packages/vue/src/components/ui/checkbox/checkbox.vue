<script setup lang="ts">
import { computed } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import type { AssertNoExtraKeys, CheckboxVueProps } from "@timui/core";
import {
  checkboxConnect,
  checkboxIndicatorCheckVariants,
  checkboxIndicatorIconVariants,
  checkboxIndicatorVariants,
  checkboxMachine,
  checkboxRootVariants,
  checkboxVariants,
  cn,
} from "@timui/core";

import { useCheckbox } from "./use-checkbox";

type CheckboxProps = CheckboxVueProps & { class?: string };
type _CheckboxPropsGuard = AssertNoExtraKeys<CheckboxProps, CheckboxProps>;

const props = defineProps<CheckboxProps>();

const emit = defineEmits(["update:modelValue", "update:checked", "change"]);
type CheckedChangeDetails = Parameters<NonNullable<CheckboxVueProps["onCheckedChange"]>>[0];

const api = useCheckbox(props, emit);
const rootProps = computed(() => api.value?.getRootProps?.() ?? {});
const controlProps = computed(() => api.value?.getControlProps?.() ?? {});
const indicatorProps = computed(() => api.value?.getIndicatorProps?.() ?? {});
const hiddenInputProps = computed(() => api.value?.getHiddenInputProps?.() ?? {});
</script>

<template>
  <label
    v-bind="rootProps"
    data-slot="checkbox-root"
    :class="cn(checkboxRootVariants(), rootProps.class)"
  >
    <button
      v-bind="controlProps"
      data-slot="checkbox"
      type="button"
      :class="
        cn(
          checkboxVariants(),
          controlProps.class,
          props.class
        )
      "
    >
      <span
        v-bind="indicatorProps"
        data-slot="checkbox-indicator"
        :class="
          cn(
            checkboxIndicatorVariants(),
            (api?.checked || api?.indeterminate) && 'opacity-100',
            indicatorProps.class
          )
        "
      >
        <span v-if="api?.indeterminate" :class="checkboxIndicatorCheckVariants()" />
        <svg
          v-else
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          :class="checkboxIndicatorIconVariants()"
        >
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      </span>
    </button>
    <input v-bind="hiddenInputProps" />
  </label>
</template>
