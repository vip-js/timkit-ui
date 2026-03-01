<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  modelValue?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  class?: HTMLAttributes["class"];
}>();

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
    "peer border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 has-[option[disabled]:checked]:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-full cursor-pointer appearance-none items-center rounded-md border text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    props.multiple ? "[&_option:checked]:bg-accent py-1 *:px-3 *:py-1" : "h-9 ps-3 pe-8",
    props.class
  )
);
</script>

<template>
  <div class="relative flex">
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
    <span
      v-if="!props.multiple"
      class="text-muted-foreground/80 peer-aria-invalid:text-destructive/80 pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center peer-disabled:opacity-50"
    >
      <ChevronDownIcon :size="16" aria-hidden="true" />
    </span>
  </div>
</template>
