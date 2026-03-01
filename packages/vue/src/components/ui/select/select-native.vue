<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";
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

type SelectNativeProps = SelectNativeVueProps & { class?: HTMLAttributes["class"] };
type _SelectNativePropsGuard = AssertNoExtraKeys<
  SelectNativeProps,
  SelectNativeVueProps & { class?: HTMLAttributes["class"] }
>;

const props = defineProps<SelectNativeProps>();

const emit = defineEmits(["update:modelValue", "change"]);
const attrs = useAttrs();

const localValue = ref<string | string[] | undefined>(
  props.modelValue ?? props.defaultValue
);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) localValue.value = val;
  }
);

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = props.multiple
    ? Array.from(target.selectedOptions).map((option) => option.value)
    : target.value;
  localValue.value = value;
  emit("update:modelValue", value);
  emit("change", value);
};

const selectClass = computed(() =>
  cn(
    selectNativeVariants({ multiple: props.multiple }),
    props.class
  )
);
</script>

<template>
  <div :class="selectNativeWrapperVariants()">
    <select
      data-slot="select-native"
      :multiple="props.multiple"
      :class="selectClass"
      v-model="localValue"
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
