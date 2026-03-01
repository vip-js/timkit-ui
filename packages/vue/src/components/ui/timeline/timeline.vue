<script setup lang="ts">
import { type HTMLAttributes, computed, ref, toRef } from "vue";
import { cn, timelineVariants } from '@timui/core';
import { provideTimelineContext } from "./timeline-context";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    defaultValue?: number;
    modelValue?: number;
    orientation?: "horizontal" | "vertical";
  }>(),
  {
    defaultValue: 1,
    orientation: "vertical",
  }
);

const emits = defineEmits<{
  (e: "update:modelValue", payload: number): void;
}>();

const internalStep = ref(props.defaultValue);
const step = computed({
  get: () => props.modelValue ?? internalStep.value,
  set: (v) => {
    internalStep.value = v;
    emits("update:modelValue", v);
  },
});

provideTimelineContext({
  activeStep: step,
  setActiveStep: (v: number) => {
    step.value = v;
  },
  orientation: toRef(props, "orientation"),
});
</script>

<template>
  <div
    data-slot="timeline"
    :class="cn(timelineVariants(), props.class)"
    :data-orientation="orientation"
  >
    <slot />
  </div>
</template>
