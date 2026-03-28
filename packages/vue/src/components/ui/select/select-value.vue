<script setup lang="ts">
import { useSelectContext } from "./use-select-context";
import { useSelectItemsContext } from "./use-select-items-context";
import { computed, type Ref } from "vue";
import { cn, selectValueVariants } from "@timui/core";

const props = defineProps<{ class?: string; placeholder?: string }>();
type SelectApi = {
  valueAsString?: string;
  value?: string | string[];
};

const api = useSelectContext() as Ref<SelectApi | undefined> | undefined;
const itemsContext = useSelectItemsContext();
const displayValue = computed(() => {
  const rawValue = api?.value?.value;
  const values = Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : [];

  if (!values || values.length === 0) return props.placeholder;

  const fallback = values
    .map((value) => itemsContext.itemLabels.value[value] ?? value)
    .join(", ");
  const hasRegisteredLabel = values.some((value) => itemsContext.itemLabels.value[value] !== undefined);
  const valueAsString = api?.value?.valueAsString;
  const resolved = hasRegisteredLabel ? fallback : valueAsString || fallback;

  return resolved || props.placeholder;
});
</script>

<template>
  <span :class="cn(selectValueVariants(), props.class)">
    <slot>
      {{ displayValue }}
    </slot>
  </span>
</template>
