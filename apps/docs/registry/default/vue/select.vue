<script setup lang="ts">
import { computed, provide, watch } from "vue";
import { selectCollection, selectConnect, selectMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";

const props = defineProps<{
  id?: string;
  modelValue?: string;
  defaultValue?: string;
  collection?: any;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const collection = props.collection || selectCollection({ items: [] });
const service = useMachine(selectMachine, {
  id: props.id,
  collection,
  value: props.modelValue ? [props.modelValue] : props.defaultValue ? [props.defaultValue] : undefined,
  onValueChange(details: any) {
    const nextValue = details.value?.[0];
    emit("update:modelValue", nextValue);
    emit("change", nextValue);
  },
});

const api = computed(() => selectConnect(service.state.value, service.send, normalizeProps));
provide("select", api);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== api.value?.value) {
      api.value?.setValue([val]);
    }
  }
);
</script>

<template>
  <slot />
</template>
