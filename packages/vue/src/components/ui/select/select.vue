<script setup lang="ts">
import { selectCollection, type SelectItem, type SelectVueProps } from "@timui/core";
import { ref } from "vue";
import { useSelect } from "./use-select";
import { provideSelectContext } from "./use-select-context";
import { provideSelectItemsContext } from "./use-select-items-context";

const props = defineProps<SelectVueProps>();

const emit = defineEmits(["update:modelValue", "change"]);

const internalCollection = selectCollection<SelectItem>({ items: [] });
const itemLabels = ref<Record<string, string>>({});

const registerItem = (item: SelectItem) => {
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

const api = useSelect(props, emit, internalCollection);
provideSelectContext(api);
provideSelectItemsContext({ registerItem, unregisterItem, itemLabels });
</script>

<template>
  <slot />
</template>
