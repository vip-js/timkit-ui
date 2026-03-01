<script setup lang="ts">
import type { AssertNoExtraKeys, TextareaVueProps } from "@timui/core";
import { cn, textareaVariants } from "@timui/core";
import { computed, type HTMLAttributes } from "vue";

type TextareaProps = TextareaVueProps & { class?: HTMLAttributes["class"] };
type _TextareaPropsGuard = AssertNoExtraKeys<
  TextareaProps,
  TextareaVueProps & { class?: HTMLAttributes["class"] }
>;

const props = defineProps<TextareaProps>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value as string | number);
  },
});
</script>

<template>
  <textarea
    v-model="modelValue"
    :class="cn(textareaVariants(), props.class)"
  />
</template>
