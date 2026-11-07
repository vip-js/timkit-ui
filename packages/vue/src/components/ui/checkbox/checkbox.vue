<script setup lang="ts">
import { computed, useAttrs } from "vue";
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
const attrs = useAttrs();

const emit = defineEmits(["update:modelValue", "update:checked", "change"]);
type CheckedChangeDetails = Parameters<NonNullable<CheckboxVueProps["onCheckedChange"]>>[0];

const api = useCheckbox(props, emit);
const rootProps = computed(() => api.value?.getRootProps?.() ?? {});
const controlProps = computed(() => api.value?.getControlProps?.() ?? {});
const indicatorProps = computed(() => api.value?.getIndicatorProps?.() ?? {});
const hiddenInputProps = computed(() => api.value?.getHiddenInputProps?.() ?? {});
const checkStatus = computed(() =>
  api.value?.indeterminate ? "Mixed" : api.value?.checked ? "Checked" : ""
);
const onPress = (event?: Event) => {
  if (props.disabled || props.readOnly || api.value?.disabled) {
    event?.preventDefault();
    return;
  }
  api.value?.toggleChecked();
};
</script>

<template>
  <p v-if="checkStatus" role="status">{{ checkStatus }}</p>
  <label
    v-bind="rootProps"
    data-slot="checkbox-root"
    :class="cn(checkboxRootVariants(), rootProps.class)"
  >
    <button
      v-bind="controlProps"
      data-slot="checkbox"
      type="button"
      :aria-label="undefined"
      :class="
        cn(
          checkboxVariants(),
          controlProps.class,
          props.class
        )
      "
      @click="onPress"
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
    <input
      v-bind="hiddenInputProps"
      :aria-checked="api?.indeterminate ? 'mixed' : undefined"
      :aria-label="attrs['aria-label'] || 'Checkbox'"
      :aria-labelledby="undefined"
      @keydown.space.prevent
      @keyup.space.prevent="onPress"
    />
  </label>
</template>
