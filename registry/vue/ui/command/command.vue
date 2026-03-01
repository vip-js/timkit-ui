<script setup lang="ts">
import { computed, provide, ref, watch, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as combobox from "@zag-js/combobox";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { commandContextKey } from '../../lib/injection-keys'

const commandVariants = cva(
    'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground'
)

const props = defineProps<{
  class?: HTMLAttributes["class"];
  value?: string | string[];
  modelValue?: string | string[];
  defaultValue?: string | string[];
  id?: string;
  multiple?: boolean;
}>();

const emit = defineEmits(["update:value", "update:modelValue", "change"]);

type CommandItem = { value: string; label: string };
const options = ref<CommandItem[]>([]);
const registerItem = (item: CommandItem) => {
  if (options.value.find((opt) => opt.value === item.value)) return;
  options.value.push(item);
};
const unregisterItem = (value: string) => {
  const index = options.value.findIndex((opt) => opt.value === value);
  if (index >= 0) options.value.splice(index, 1);
};

const collection = computed(() =>
  combobox.collection({
    items: options.value,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })
);

const currentValue = computed(() => props.value ?? props.modelValue);

const service = useMachine(combobox.machine, {
  id: props.id,
  collection: collection.value,
  selectionMode: props.multiple ? "multiple" : "single",
  value: props.multiple
    ? (Array.isArray(currentValue.value) ? currentValue.value : (currentValue.value ? [currentValue.value] : []))
    : (currentValue.value !== undefined && !Array.isArray(currentValue.value) ? [currentValue.value] : undefined),
  defaultValue: props.defaultValue
    ? (Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue])
    : undefined,
  onValueChange(details) {
    const nextValue = props.multiple ? details.value : details.value?.[0];
    emit("update:value", nextValue);
    emit("update:modelValue", nextValue);
    emit("change", nextValue);
  },
  inputBehavior: "autohighlight",
  open: true,
});

const api = computed(() => combobox.connect(service, normalizeProps));
const rootEl = ref<HTMLElement | null>(null);

watch(
  () => props.value ?? props.modelValue,
  (val) => {
    if (val !== undefined && val !== api.value.value?.[0]) {
      api.value.setValue([val]);
    }
  }
);

provide(commandContextKey, {
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
    :class="cn(commandVariants(), props.class)"
    v-bind="api.getRootProps()"
    ref="rootEl"
  >
    <slot />
  </div>
</template>
