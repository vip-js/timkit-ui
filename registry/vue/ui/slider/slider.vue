<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { normalizeProps, useMachine } from "@zag-js/vue";
import * as slider from "@zag-js/slider";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const sliderRootVariants = cva(
    'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col'
)
const sliderTrackVariants = cva(
    'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
)
const sliderRangeVariants = cva(
    'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
)
const sliderThumbVariants = cva(
    'border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50'
)

type SliderProps = {
  modelValue?: number[];
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  id?: string;
  name?: string;
  class?: HTMLAttributes["class"];
};

const props = defineProps<SliderProps>();

const emit = defineEmits(["update:modelValue", "change", "commit"]);

const machineProps = computed(() => ({
  id: props.id,
  value: props.modelValue ?? props.value,
  defaultValue:
    props.modelValue === undefined && props.value === undefined
      ? props.defaultValue
      : undefined,
  min: props.min ?? 0,
  max: props.max ?? 100,
  step: props.step ?? 1,
  disabled: props.disabled,
  name: props.name,
  onValueChange(details: { value: number[] }) {
    emit("update:modelValue", details.value);
    emit("change", details.value);
  },
  onValueChangeEnd(details: { value: number[] }) {
    emit("commit", details.value);
  },
}));

const service = useMachine(slider.machine, machineProps);
const api = computed(() => slider.connect(service, normalizeProps));
const rootProps = computed(() => api.value?.getRootProps?.() ?? {});
const trackProps = computed(() => api.value?.getTrackProps?.() ?? {});
const rangeProps = computed(() => api.value?.getRangeProps?.() ?? {});

const getThumbProps = (index: number) =>
  api.value?.getThumbProps?.({ index }) ?? {};
const getHiddenInputProps = (index: number) =>
  api.value?.getHiddenInputProps?.({ index }) ?? {};

const thumbPropsList = computed(() =>
  (api.value?.value ?? []).map((_, index) => getThumbProps(index))
);
const hiddenInputPropsList = computed(() =>
  (api.value?.value ?? []).map((_, index) => getHiddenInputProps(index))
);
</script>

<template>
  <div
    v-bind="rootProps"
    data-slot="slider"
    :class="cn(sliderRootVariants(), props.class)"
  >
    <div
      v-bind="trackProps"
      data-slot="slider-track"
      :class="cn(sliderTrackVariants(), trackProps.class)"
    >
      <div
        v-bind="rangeProps"
        data-slot="slider-range"
        :class="cn(sliderRangeVariants(), rangeProps.class)"
      />
    </div>
    <template v-for="(thumbProps, index) in thumbPropsList" :key="index">
      <div
        v-bind="thumbProps"
        data-slot="slider-thumb"
        :class="cn(sliderThumbVariants(), thumbProps.class)"
      />
      <input v-bind="hiddenInputPropsList[index] ?? {}" />
    </template>
  </div>
</template>
