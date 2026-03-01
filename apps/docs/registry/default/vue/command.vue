<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { comboboxCollection, comboboxConnect, comboboxMachine } from "@timui/core";
import { cn } from "@timui/core";
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  value?: string;
  modelValue?: string;
  defaultValue?: string;
  id?: string;
}>();

const emit = defineEmits(["update:value", "update:modelValue", "change"]);

const options = ref<any[]>([]);
const registerItem = (item: any) => {
  if (options.value.find((opt) => opt.value === item.value)) return;
  options.value.push(item);
};
const unregisterItem = (value: string) => {
  const index = options.value.findIndex((opt) => opt.value === value);
  if (index >= 0) options.value.splice(index, 1);
};

const collection = comboboxCollection({
  items: options.value,
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
});

const service = useMachine(comboboxMachine, {
  id: props.id,
  collection,
  value: props.value ?? props.modelValue ? [props.value ?? props.modelValue] : undefined,
  defaultValue:
    props.value === undefined && props.modelValue === undefined && props.defaultValue
      ? [props.defaultValue]
      : undefined,
  onValueChange(details: any) {
    const nextValue = details.value?.[0];
    emit("update:value", nextValue);
    emit("update:modelValue", nextValue);
    emit("change", nextValue);
  },
  inputBehavior: "autohighlight",
  loop: true,
  open: true,
});

const api = computed(() => comboboxConnect(service, normalizeProps));
const rootEl = ref<HTMLElement | null>(null);

watch(
  () => props.value ?? props.modelValue,
  (val) => {
    if (val !== undefined && val !== api.value?.value?.[0]) {
      api.value?.setValue([val]);
    }
  }
);

provide("command", {
  api,
  registerItem,
  unregisterItem,
});

defineExpose({
  rootEl,
  api,
});
</script>

<template>
  <div
    :class="
      cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        props.class
      )
    "
    v-bind="api?.getRootProps?.()"
    ref="rootEl"
  >
    <slot />
  </div>
</template>
