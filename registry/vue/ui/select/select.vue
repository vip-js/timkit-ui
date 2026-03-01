<script setup lang="ts">
import { computed, provide, getCurrentInstance, type HTMLAttributes } from "vue";
import * as select from "@zag-js/select";
import { normalizeProps, useMachine } from "@zag-js/vue";
import type { SelectContext } from "@zag-js/select";
import { selectContextKey } from '../../lib/injection-keys'

const props = defineProps<Omit<SelectContext, "id" | "collection"> & { 
  items?: any[]; /* simplified */
  modelValue?: any;
}>();

const emit = defineEmits(["update:modelValue", "change"]);

const instance = getCurrentInstance();

const collection = computed(() =>
  select.collection({ items: props.items ?? [], itemToString: (item) => item.label, itemToValue: (item) => item.value })
);

const context = computed(() => ({
  id: `select-${instance?.uid}`,
  collection: collection.value,
  ...props,
  value: props.modelValue ? [props.modelValue] : undefined,
  onValueChange: (details: any) => {
    emit("update:modelValue", details.value[0]);
    emit("change", details.value[0]); // Adapting to single value select for now
  }
}));

const service = useMachine(select.machine, context);
const api = computed(() => select.connect(service, normalizeProps));

provide(selectContextKey, api);
</script>

<template>
  <slot />
</template>
