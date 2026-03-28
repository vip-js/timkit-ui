<script setup lang="ts">
import { computed } from 'vue'
import type { AssertNoExtraKeys, SliderVueProps } from '@timui/core'
import {
  cn,
  sliderRangeVariants,
  sliderRootVariants,
  sliderThumbVariants,
  sliderTrackVariants,
} from '@timui/core'
import type { HTMLAttributes } from 'vue'

import { useSlider } from './use-slider'

type SliderProps = SliderVueProps & { class?: HTMLAttributes['class'] }
type _SliderPropsGuard = AssertNoExtraKeys<SliderProps, SliderProps>

const props = defineProps<SliderProps>()

const emit = defineEmits(['update:modelValue', 'change', 'commit'])

const api = useSlider(props, emit)
const rootProps = computed(() => api.value?.getRootProps?.() ?? {})
const controlProps = computed(() => api.value?.getControlProps?.() ?? {})
const trackProps = computed(() => api.value?.getTrackProps?.() ?? {})
const rangeProps = computed(() => api.value?.getRangeProps?.() ?? {})

const getThumbProps = (index: number) =>
  api.value?.getThumbProps?.({ index }) ?? {}
const getHiddenInputProps = (index: number) =>
  api.value?.getHiddenInputProps?.({ index }) ?? {}

const thumbPropsList = computed(() =>
  (api.value?.value ?? []).map((_, index) => getThumbProps(index))
)
const hiddenInputPropsList = computed(() =>
  (api.value?.value ?? []).map((_, index) => getHiddenInputProps(index))
)
const isVertical = computed(() => (props.orientation ?? 'horizontal') === 'vertical')

function getTooltipValue(index: number) {
  return api.value?.value?.[index] ?? props.min ?? 0
}

function getTooltipText(index: number) {
  const value = getTooltipValue(index)
  return props.tooltipContent ? props.tooltipContent(value) : `${value}`
}
</script>

<template>
  <div
    v-bind="rootProps"
    data-slot="slider"
    :class="cn(sliderRootVariants(), props.class)"
  >
    <div
      v-bind="controlProps"
      data-slot="slider-control"
      :class="
        cn(
          'relative flex w-full touch-none items-center select-none data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          controlProps.class
        )
      "
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
        >
          <span
            v-if="props.showTooltip"
            :class="
              cn(
                'bg-foreground text-background pointer-events-none absolute z-10 inline-flex min-w-6 items-center justify-center rounded px-1.5 py-0.5 text-[11px] leading-none font-medium whitespace-nowrap shadow-sm',
                isVertical
                  ? 'top-1/2 left-full ml-2 -translate-y-1/2'
                  : '-top-8 left-1/2 -translate-x-1/2'
              )
            "
          >
            {{ getTooltipText(index) }}
          </span>
        </div>
        <input v-bind="hiddenInputPropsList[index] ?? {}" />
      </template>
    </div>
  </div>
</template>
