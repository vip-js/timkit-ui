<script setup lang="ts">
import { computed, provide } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { accordionConnect, accordionMachine } from "@timui/core";

const props = defineProps<{
  modelValue?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  collapsible?: boolean;
  disabled?: boolean;
  class?: string;
  id?: string;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const toArray = (value?: string | string[] | null) => {
  if (value == null) return undefined;
  return Array.isArray(value) ? value : value === "" ? [] : [value];
};

const toValue = (value: string[], multiple?: boolean) => {
  if (multiple) return value;
  return value[0] ?? "";
};

const machineProps = computed(() => {
  const value = toArray(props.modelValue);
  const defaultValue = toArray(props.defaultValue);
  return {
    id: props.id,
    multiple: props.multiple,
    collapsible: props.collapsible,
    disabled: props.disabled,
    value,
    defaultValue: value === undefined ? defaultValue : undefined,
    onValueChange(details: any) {
      const nextValue = toValue(details.value, props.multiple);
      emit("update:modelValue", nextValue);
      emit("change", nextValue);
    },
  };
});

const service = useMachine(accordionMachine, machineProps);
const api = computed(() => accordionConnect(service, normalizeProps));
provide("accordion", api);
</script>

<template>
  <div v-bind="api.value.getRootProps()" data-slot="accordion" :class="props.class">
    <slot />
  </div>
</template>
