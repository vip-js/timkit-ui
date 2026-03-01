<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as accordion from "@zag-js/accordion";
import { cn } from "../../lib/utils";
import { AccordionProvider } from "./accordion-context";

const props = defineProps<{
  modelValue?: string | string[];
  defaultValue?: string | string[];
  type?: "single" | "multiple";
  multiple?: boolean;
  collapsible?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
  id?: string;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const toArray = (value?: string | string[] | null) => {
  if (value == null) return undefined;
  return Array.isArray(value) ? value : value === "" ? [] : [value];
};

const toValue = (value: string[], multiple: boolean) => {
  if (multiple) return value;
  return value[0] ?? "";
};

const machineProps = computed(() => {
  const multiple = props.type
    ? props.type === "multiple"
    : !!props.multiple;
  const value = toArray(props.modelValue);
  const defaultValue = toArray(props.defaultValue);
  return {
    id: props.id,
    multiple,
    collapsible: props.collapsible,
    disabled: props.disabled,
    value,
    defaultValue: value === undefined ? defaultValue : undefined,
    onValueChange(details: any) {
      const nextValue = toValue(details.value, multiple);
      emit("update:modelValue", nextValue);
      emit("change", nextValue);
    },
  };
});

const service = useMachine(accordion.machine, machineProps);
const api = computed(() => accordion.connect(service, normalizeProps));
AccordionProvider(computed(() => ({ api: api.value })));
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="accordion" :class="props.class">
    <slot />
  </div>
</template>
