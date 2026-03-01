<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as tabs from "@zag-js/tabs";
import { tabsContextKey } from '../../lib/injection-keys'

const props = defineProps<{
  modelValue?: string;
  value?: string;
  defaultValue?: string;
  id?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "manual" | "automatic";
  loopFocus?: boolean;
  composite?: boolean;
  deselectable?: boolean;
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:modelValue", "change", "focusChange"]);

const machineProps = computed(() => {
  const value = props.value ?? props.modelValue ?? null;
  return {
    id: props.id,
    value,
    defaultValue: value == null ? props.defaultValue ?? null : undefined,
    orientation: props.orientation,
    activationMode: props.activationMode,
    loopFocus: props.loopFocus,
    composite: props.composite,
    deselectable: props.deselectable,
    onValueChange(details: { value: string }) {
      emit("update:modelValue", details.value);
      emit("change", details.value);
    },
    onFocusChange(details: { focusedValue: string }) {
      emit("focusChange", details.focusedValue);
    },
  };
});

const service = useMachine(tabs.machine, machineProps);
const api = computed(() => tabs.connect(service, normalizeProps));

provide(tabsContextKey, api);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="tabs" :class="props.class">
    <slot />
  </div>
</template>
