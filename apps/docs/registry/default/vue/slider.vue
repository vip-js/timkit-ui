<script setup lang="ts">
import { computed, useId } from "vue";
import type { AssertNoExtraKeys, SliderVueProps } from "@timui/core";
import { sliderConnect, sliderMachine } from "@timui/core";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { cn } from "@timui/core";
import type { HTMLAttributes } from "vue";

type SliderProps = SliderVueProps & { class?: HTMLAttributes["class"] };
type _SliderPropsGuard = AssertNoExtraKeys<SliderProps, SliderProps>;

const props = defineProps<SliderProps>();

const emit = defineEmits(["update:modelValue", "change", "commit"]);
const generatedId = useId();

const machineProps = computed(() => ({
  id: props.id ?? generatedId,
  value: props.modelValue ?? props.value,
  defaultValue:
    props.modelValue === undefined && props.value === undefined
      ? props.defaultValue
      : undefined,
  min: props.min ?? 0,
  max: props.max ?? 100,
  step: props.step ?? 1,
  disabled: props.disabled,
  onValueChange(details: any) {
    emit("update:modelValue", details.value);
    emit("change", details.value);
  },
  onValueCommit(details: any) {
    emit("commit", details.value);
  },
}));

const service = useMachine(sliderMachine, machineProps);
const api = computed(() => sliderConnect(service, normalizeProps));
const rootProps = computed(() => api.value?.getRootProps?.() ?? {});
const controlProps = computed(() => api.value?.getControlProps?.() ?? {});
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
    :class="
      cn(
        'relative flex w-full touch-none select-none items-center data-[disabled=true]:opacity-50',
        props.class
      )
    "
  >
    <div
      v-bind="controlProps"
      data-slot="slider-control"
      :class="
        cn(
          'relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          controlProps.class
        )
      "
    >
      <div
        v-bind="trackProps"
        data-slot="slider-track"
        :class="cn('relative h-2 w-full grow overflow-hidden rounded-full bg-secondary', trackProps.class)"
      >
        <div
          v-bind="rangeProps"
          data-slot="slider-range"
          :class="cn('absolute h-full bg-primary', rangeProps.class)"
        />
      </div>
      <template v-for="(thumbProps, index) in thumbPropsList" :key="index">
        <div
          v-bind="thumbProps"
          data-slot="slider-thumb"
          :class="
            cn(
              'absolute block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              thumbProps.class
            )
          "
        />
        <input v-bind="hiddenInputPropsList[index] ?? {}" />
      </template>
    </div>
  </div>
</template>
