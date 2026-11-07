<script setup lang="ts">
import { computed, provide, ref } from "vue";
import { useAccordion } from "./use-accordion";
import { AccordionProvider } from "./use-accordion-context";

const props = defineProps<{
  modelValue?: string | string[] | null;
  defaultValue?: string | string[];
  type?: "single" | "multiple";
  multiple?: boolean;
  collapsible?: boolean;
  disabled?: boolean;
  onValueChange?: (value: string | string[]) => void;
  class?: string;
  id?: string;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const api = useAccordion(props, emit);
AccordionProvider(api);
const registered = ref<string[]>([]);
const registerItem = (value: string) => {
  if (registered.value.includes(value)) return;
  registered.value = [...registered.value, value];
};
provide("accordion-register", registerItem);
const openStatus = computed(() => {
  const raw = api.value.value as string | string[] | undefined;
  const open = Array.isArray(raw) ? raw.filter(Boolean) : raw ? [raw] : [];
  if (open.length === 0) return "";
  if (open.length === 1) {
    const index = registered.value.indexOf(open[0] ?? "");
    return index < 0 ? "" : `Item ${index + 1} of ${registered.value.length}`;
  }
  return `${open.length} items open`;
});
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="accordion" :class="props.class">
    <p v-if="openStatus" role="status">{{ openStatus }}</p>
    <slot />
  </div>
</template>
