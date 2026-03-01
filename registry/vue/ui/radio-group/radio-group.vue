<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as radio from "@zag-js/radio-group";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { radioGroupContextKey } from '../../lib/injection-keys'

const radioGroupVariants = cva('grid gap-3')

type RadioGroupProps = {
  modelValue?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  orientation?: "horizontal" | "vertical";
  class?: HTMLAttributes["class"];
};

const props = defineProps<RadioGroupProps>();

const emit = defineEmits(["update:modelValue", "change"]);

const machineProps = computed(() => ({
  id: props.id,
  value: props.modelValue ?? props.value,
  defaultValue:
    props.modelValue === undefined && props.value === undefined
      ? props.defaultValue
      : undefined,
  disabled: props.disabled,
  required: props.required,
  name: props.name,
  orientation: props.orientation,
  onValueChange(details: { value: string }) {
    emit("update:modelValue", details.value);
    emit("change", details.value);
  },
}));

const service = useMachine(radio.machine, machineProps);
const api = computed(() => radio.connect(service, normalizeProps));

provide(radioGroupContextKey, api);
</script>

<template>
  <div
    v-bind="api?.getRootProps?.()"
    data-slot="radio-group"
    :class="cn(radioGroupVariants(), props.class)"
  >
    <slot />
  </div>
</template>
