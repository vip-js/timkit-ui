<script setup lang="ts">
import { type HTMLAttributes, computed, ref, toRef, useAttrs } from "vue";
import { cn, timelineVariants } from '@timui/core';
import { provideTimelineContext } from "./timeline-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    defaultValue?: number;
    modelValue?: number;
    orientation?: "horizontal" | "vertical";
    disabled?: boolean;
  }>(),
  {
    defaultValue: 1,
    orientation: "vertical",
  }
);

const emits = defineEmits<{
  (e: "update:modelValue", payload: number): void;
  (e: "valueChange", payload: number): void;
}>();

const attrs = useAttrs();
const passthrough = computed(() => {
  const { "aria-label": _label, "aria-labelledby": _by, ...rest } = attrs;
  return rest;
});
const labelledBy = computed(() => {
  const value = attrs["aria-labelledby"];
  return typeof value === "string" && value ? value : undefined;
});
const timelineLabel = computed(() => {
  if (labelledBy.value) return undefined;
  const label = attrs["aria-label"];
  return typeof label === "string" && label ? label : "Timeline";
});
const internalStep = ref(props.defaultValue);
const registered = ref<number[]>([]);
const registerStep = (next: number) => {
  if (registered.value.includes(next)) return;
  registered.value = [...registered.value, next];
};
const stepStatus = computed(() => {
  const active = step.value;
  const index = active == null ? -1 : registered.value.indexOf(active);
  return index < 0 ? "" : `Step ${index + 1} of ${registered.value.length}`;
});
const step = computed({
  get: () => (props.modelValue === undefined ? internalStep.value : props.modelValue),
  set: (v) => {
    if (props.modelValue === undefined) internalStep.value = v;
    emits("update:modelValue", v);
    emits("valueChange", v);
  },
});

provideTimelineContext({
  activeStep: step,
  setActiveStep: (v: number) => {
    if (props.disabled) return;
    step.value = v;
  },
  orientation: toRef(props, "orientation"),
  disabled: computed(() => props.disabled === true),
  registerStep,
});
</script>

<template>
  <div
    data-slot="timeline"
    :class="cn(timelineVariants(), props.class)"
    :data-orientation="orientation"
    :aria-disabled="props.disabled || undefined"
    :data-disabled="props.disabled ? '' : undefined"
    v-bind="passthrough"
    :aria-labelledby="labelledBy"
    :aria-label="timelineLabel"
  >
    <p v-if="stepStatus" role="status">{{ stepStatus }}</p>
    <slot />
  </div>
</template>
