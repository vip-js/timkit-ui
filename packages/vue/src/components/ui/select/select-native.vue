<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, watch, type VNode } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";
import {
  cn,
  selectNativeIndicatorVariants,
  selectNativeVariants,
  selectNativeWrapperVariants,
} from "@timui/core";
import type { HTMLAttributes } from "vue";
import type { AssertNoExtraKeys, SelectNativeVueProps } from "@timui/core";

defineOptions({
  inheritAttrs: false,
});

type SelectNativeProps = SelectNativeVueProps & {
  class?: HTMLAttributes["class"];
  disabled?: boolean;
};
type _SelectNativePropsGuard = AssertNoExtraKeys<
  SelectNativeProps,
  SelectNativeVueProps & { class?: HTMLAttributes["class"]; disabled?: boolean }
>;

const props = defineProps<SelectNativeProps>();

const emit = defineEmits(["update:modelValue", "change"]);
const attrs = useAttrs();

const emptyValue = () => (props.multiple ? [] : "");
const localValue = ref<string | string[]>(
  props.modelValue === undefined
    ? (props.defaultValue ?? emptyValue())
    : props.modelValue === null
      ? emptyValue()
      : props.modelValue
);
const disabled = computed(
  () =>
    props.disabled === true ||
    attrs.disabled === true ||
    attrs.disabled === "" ||
    attrs.disabled === "disabled"
);

watch(
  () => props.modelValue,
  (val) => {
    if (val === undefined) return;
    localValue.value = val === null ? emptyValue() : val;
  }
);

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  if (disabled.value) {
    target.value = Array.isArray(localValue.value) ? "" : String(localValue.value);
    return;
  }
  const value = props.multiple
    ? Array.from(target.selectedOptions).map((option) => option.value)
    : target.value;
  if (props.modelValue === undefined) localValue.value = value;
  else target.value = Array.isArray(localValue.value) ? "" : String(localValue.value ?? "");
  emit("update:modelValue", value);
  emit("change", value);
};

const slots = useSlots();
const optionValues = computed(() => {
  const values: string[] = [];
  const walk = (nodes: VNode[]) => {
    for (const node of nodes) {
      const props = node.props as { value?: unknown } | null;
      if (node.type === "option" && props?.value != null) values.push(String(props.value));
      if (Array.isArray(node.children)) walk(node.children as VNode[]);
    }
  };
  walk(slots.default?.() ?? []);
  return values;
});
const optionStatus = computed(() => {
  const values = optionValues.value;
  const current = Array.isArray(localValue.value) ? localValue.value : [localValue.value];
  const picked = current.map(String).filter((item) => item && values.includes(item));
  if (picked.length > 1) return `${picked.length} options selected`;
  if (picked.length === 1) return `Option ${values.indexOf(picked[0]) + 1} of ${values.length}`;
  return "";
});

const selectClass = computed(() =>
  cn(
    selectNativeVariants({ multiple: props.multiple }),
    props.class
  )
);
</script>

<template>
  <div :class="selectNativeWrapperVariants()">
    <p v-if="optionStatus" role="status">{{ optionStatus }}</p>
    <select
      data-slot="select-native"
      :multiple="props.multiple"
      :class="selectClass"
      :value="localValue"
      :disabled="disabled"
      v-bind="attrs"
      @change="onChange"
    >
      <slot />
    </select>
    <span v-if="!props.multiple" :class="selectNativeIndicatorVariants()">
      <ChevronDownIcon :size="16" aria-hidden="true" />
    </span>
  </div>
</template>
