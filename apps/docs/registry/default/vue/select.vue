<script setup lang="ts">
import { computed, provide, ref, watch } from "vue";
import { selectCollection, selectConnect, selectMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";

const props = defineProps<{
  id?: string;
  modelValue?: string;
  defaultValue?: string;
  collection?: any;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const internalCollection = selectCollection({ items: [] });
const collection = props.collection || internalCollection;
const itemLabels = ref<Record<string, string>>({});

const registerItem = (item: { label: string; value: string; disabled?: boolean }) => {
  if (!props.collection) {
    internalCollection.upsert(item.value, item);
  }
  itemLabels.value = { ...itemLabels.value, [item.value]: item.label };
};

const unregisterItem = (value: string) => {
  if (!props.collection) {
    internalCollection.remove(value);
  }
  if (!(value in itemLabels.value)) return;
  const next = { ...itemLabels.value };
  delete next[value];
  itemLabels.value = next;
};

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
provide("selectItems", { registerItem, unregisterItem, itemLabels });

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== api.value?.value?.[0]) {
      api.value?.setValue([val]);
    }
  }
);
</script>

<template>
  <slot />
</template>
