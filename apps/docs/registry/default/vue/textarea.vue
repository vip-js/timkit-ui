<script setup lang="ts">
import { cn, textareaVariants } from "@/lib/utils";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  modelValue?: string | number;
}>();

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
