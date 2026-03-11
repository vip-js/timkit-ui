<script setup lang="ts">
import type { AssertNoExtraKeys, TextareaVueProps, TextInputValueChangeEvent } from "@timui/core";
import { cn, textareaVariants, createTimEvent } from "@timui/core";
import { computed, type HTMLAttributes, useId } from "vue";

type TextareaProps = TextareaVueProps & { class?: HTMLAttributes["class"] };
type _TextareaPropsGuard = AssertNoExtraKeys<
  TextareaProps,
  TextareaVueProps & { class?: HTMLAttributes["class"] }
>;

const props = defineProps<TextareaProps>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
  (e: "valueChange", event: TextInputValueChangeEvent): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emits("update:modelValue", value as string | number);
  },
});

const generatedId = useId()
const textareaId = computed(() => props.id ?? generatedId)

const handleChange = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  if (props.onValueChange) {
    props.onValueChange(createTimEvent('change', textareaId.value, { value: target.value }))
  }
  emits('valueChange', createTimEvent('change', textareaId.value, { value: target.value }))
}
</script>

<template>
  <textarea
    v-model="modelValue"
    data-slot="textarea"
    :id="textareaId"
    :class="cn(textareaVariants(), props.class)"
    @input="handleChange"
  />
</template>
