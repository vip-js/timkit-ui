<script setup lang="ts">
import { useAccordion } from "./use-accordion";
import { AccordionProvider } from "./use-accordion-context";

const props = defineProps<{
  modelValue?: string | string[];
  defaultValue?: string | string[];
  type?: "single" | "multiple";
  multiple?: boolean;
  collapsible?: boolean;
  disabled?: boolean;
  class?: string;
  id?: string;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const api = useAccordion(props, emit);
AccordionProvider(api);
</script>

<template>
  <div v-bind="api.getRootProps()" data-slot="accordion" :class="props.class">
    <slot />
  </div>
</template>
