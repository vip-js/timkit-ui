<script setup lang="ts">
import { selectCollection, type SelectItem, type SelectVueProps } from "@timui/core";
import { computed, provide, ref } from "vue";
import { useSelect } from "./use-select";
import { provideSelectContext } from "./use-select-context";
import { provideSelectItemsContext } from "./use-select-items-context";
import { returnFocusKey, useReturnFocus } from "../use-return-focus";

const props = defineProps<SelectVueProps & { readOnly?: boolean }>();

const emit = defineEmits(["update:modelValue", "change"]);

const items = ref<SelectItem[]>([]);
const collection = computed(() => props.collection ?? selectCollection<SelectItem>({ items: items.value }));
const itemLabels = ref<Record<string, string>>({});

const registerItem = (item: SelectItem) => {
  if (!props.collection) {
    const index = items.value.findIndex((entry) => entry.value === item.value);
    items.value =
      index === -1
        ? [...items.value, item]
        : items.value.map((entry, entryIndex) => (entryIndex === index ? item : entry));
  }
  itemLabels.value = { ...itemLabels.value, [item.value]: item.label };
};

const unregisterItem = (value: string) => {
  if (!props.collection) {
    items.value = items.value.filter((entry) => entry.value !== value);
  }
  if (!(value in itemLabels.value)) return;
  const next = { ...itemLabels.value };
  delete next[value];
  itemLabels.value = next;
};

const api = useSelect(props, emit, collection);
const optionStatus = computed(() => {
  const raw = api.value.value as string | string[] | undefined;
  const selected = Array.isArray(raw) ? raw.filter(Boolean) : raw ? [String(raw)] : [];
  if (selected.length === 0) return "";
  if (selected.length === 1) {
    const index = items.value.findIndex((item) => item.value === selected[0]);
    return index < 0 ? "" : `Option ${index + 1} of ${items.value.length}`;
  }
  return `${selected.length} options selected`;
});
provide(returnFocusKey, useReturnFocus(computed(() => !!api.value.open)));
provideSelectContext(api);
provideSelectItemsContext({
  registerItem,
  unregisterItem,
  itemLabels,
  placeholder: computed(() => props.placeholder),
});
</script>

<template>
  <p v-if="optionStatus" role="status">{{ optionStatus }}</p>
  <slot />
</template>
