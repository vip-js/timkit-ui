<script setup lang="ts">
import { computed, getCurrentInstance, provide, onMounted, type HTMLAttributes } from "vue";
import * as combobox from "@zag-js/combobox";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { comboboxContextKey } from '../../lib/injection-keys'

const comboboxRootVariants = cva('flex flex-col gap-1')

type ComboboxProps = {
  class?: HTMLAttributes['class'];
  items?: combobox.Item[];
  modelValue?: string[];
  defaultValue?: string[];
} & Omit<combobox.Context, "id" | "ids" | "value" | "defaultValue" | "collection">;

const props = defineProps<ComboboxProps>();
const emit = defineEmits(["update:modelValue", "change"]);

const instance = getCurrentInstance();

const collection = computed(() =>
  combobox.collection({ items: props.items ?? [] })
);

const context = computed(() => {
  const { class: _, items, modelValue, defaultValue, ...rest } = props;
  return {
    id: `combobox-${instance?.uid}`,
    collection: collection.value,
    value: modelValue,
    defaultValue,
    onValueChange: (details: combobox.ValueChangeDetails) => {
      emit("update:modelValue", details.value);
      emit("change", details.value);
    },
    ...rest
  };
});

const service = useMachine(combobox.machine, context);
const api = computed(() => combobox.connect(service, normalizeProps));

provide(comboboxContextKey, api);
</script>

<template>
  <div v-bind="api.getRootProps()" :class="cn(comboboxRootVariants(), props.class)">
    <slot />
  </div>
</template>
