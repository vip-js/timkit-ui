<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as checkbox from "@zag-js/checkbox";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const checkboxRootVariants = cva('inline-flex items-center')
const checkboxVariants = cva(
    'peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex size-4 shrink-0 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50'
)
const checkboxIndicatorVariants = cva(
    'flex items-center justify-center text-current opacity-0 transition-opacity duration-100'
)
const checkboxIndicatorCheckVariants = cva('h-0.5 w-2 rounded-full bg-current')
const checkboxIndicatorIconVariants = cva('size-3.5')

type CheckboxProps = {
  modelValue?: boolean | boolean[];
  checked?: boolean | boolean[] | "indeterminate";
  defaultChecked?: boolean | boolean[];
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
  class?: HTMLAttributes['class'];
};

const props = defineProps<CheckboxProps>();

const emit = defineEmits(["update:modelValue", "change"]);

const machineProps = computed(() => ({
  id: props.id,
  checked: props.modelValue ?? props.checked,
  defaultChecked:
    props.modelValue === undefined && props.checked === undefined
      ? props.defaultChecked
      : undefined,
  disabled: props.disabled,
  required: props.required,
  name: props.name,
  value: props.value,
  onCheckedChange(details: any) {
    emit("update:modelValue", details.checked);
    emit("change", details.checked);
  },
}));

const service = useMachine(checkbox.machine, machineProps);
const api = computed(() => checkbox.connect(service, normalizeProps));
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
