<script setup lang="ts">
import { computed } from "vue";
import type { AssertNoExtraKeys, SliderVueProps } from "@timui/core";
import { sliderConnect, sliderMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import {
  cn,
  sliderRangeVariants,
  sliderRootVariants,
  sliderThumbVariants,
  sliderTrackVariants,
} from "@timui/core";
import type { HTMLAttributes } from "vue";

import { useSlider } from "./use-slider";

type SliderProps = SliderVueProps & { class?: HTMLAttributes["class"] };
type _SliderPropsGuard = AssertNoExtraKeys<SliderProps, SliderProps>;

const props = defineProps<SliderProps>();

const emit = defineEmits(["update:modelValue", "change", "commit"]);

const api = useSlider(props, emit);
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
