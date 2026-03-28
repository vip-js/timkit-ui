<script setup lang="ts">
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';
import { useSliderWithInput } from '@/registry/default/hooks/use-slider-with-input-vue';

const minValue = 0;
const maxValue = 100;
const initialValue = [25];

const {
  sliderValue,
  inputValues,
  validateAndUpdateValue,
  handleInputChange,
  handleSliderChange,
} = useSliderWithInput({ minValue, maxValue, initialValue });
</script>

<template>
  <div class="*:not-first:mt-3">
    <Label>Slider with input</Label>
    <div class="flex items-center gap-4">
      <Slider
        class="grow"
        :value="sliderValue"
        @update:modelValue="handleSliderChange"
        :min="minValue"
        :max="maxValue"
        aria-label="Slider with input"
      />
      <Input
        class="h-8 w-12 px-2 py-1"
        type="text"
        inputMode="decimal"
        :model-value="inputValues[0] ?? ''"
        @update:modelValue="(next) => handleInputChange(next, 0)"
        @blur="() => validateAndUpdateValue(inputValues[0] ?? '', 0)"
        @keydown.enter.prevent="validateAndUpdateValue(inputValues[0] ?? '', 0)"
        aria-label="Enter value"
      />
    </div>
  </div>
</template>
