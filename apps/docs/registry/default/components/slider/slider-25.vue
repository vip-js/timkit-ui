<script setup lang="ts">
import { RotateCcwIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';
import { useSliderWithInput } from '@/registry/default/hooks/use-slider-with-input-vue';

const minValue = -10;
const maxValue = 10;
const defaultValue = [0];

const {
  sliderValue: xSliderValue,
  inputValues: xInputValues,
  validateAndUpdateValue: validateX,
  handleInputChange: handleXInput,
  handleSliderChange: handleXSlider,
  resetToDefault: resetX,
} = useSliderWithInput({ minValue, maxValue, initialValue: [-2], defaultValue });

const {
  sliderValue: ySliderValue,
  inputValues: yInputValues,
  validateAndUpdateValue: validateY,
  handleInputChange: handleYInput,
  handleSliderChange: handleYSlider,
  resetToDefault: resetY,
} = useSliderWithInput({ minValue, maxValue, initialValue: [4], defaultValue });

const {
  sliderValue: zSliderValue,
  inputValues: zInputValues,
  validateAndUpdateValue: validateZ,
  handleInputChange: handleZInput,
  handleSliderChange: handleZSlider,
  resetToDefault: resetZ,
} = useSliderWithInput({ minValue, maxValue, initialValue: [2], defaultValue });

function resetAll() {
  resetX();
  resetY();
  resetZ();
}
</script>

<template>
  <div class="space-y-4">
    <legend class="text-foreground text-sm font-medium">Object position</legend>

    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <Label class="text-muted-foreground text-xs">X</Label>
        <Slider
          class="grow [&>:last-child>span]:rounded"
          :value="xSliderValue"
          @update:modelValue="handleXSlider"
          :min="minValue"
          :max="maxValue"
          aria-label="X"
        />
        <Input
          class="h-8 w-12 px-2 py-1"
          type="text"
          inputMode="decimal"
          :model-value="xInputValues[0] ?? ''"
          @update:modelValue="(next) => handleXInput(next, 0)"
          @blur="() => validateX(xInputValues[0] ?? '', 0)"
          @keydown.enter.prevent="validateX(xInputValues[0] ?? '', 0)"
          aria-label="Enter X value"
        />
      </div>

      <div class="flex items-center gap-2">
        <Label class="text-muted-foreground text-xs">Y</Label>
        <Slider
          class="grow [&>:last-child>span]:rounded"
          :value="ySliderValue"
          @update:modelValue="handleYSlider"
          :min="minValue"
          :max="maxValue"
          aria-label="Y"
        />
        <Input
          class="h-8 w-12 px-2 py-1"
          type="text"
          inputMode="decimal"
          :model-value="yInputValues[0] ?? ''"
          @update:modelValue="(next) => handleYInput(next, 0)"
          @blur="() => validateY(yInputValues[0] ?? '', 0)"
          @keydown.enter.prevent="validateY(yInputValues[0] ?? '', 0)"
          aria-label="Enter Y value"
        />
      </div>

      <div class="flex items-center gap-2">
        <Label class="text-muted-foreground text-xs">Z</Label>
        <Slider
          class="grow [&>:last-child>span]:rounded"
          :value="zSliderValue"
          @update:modelValue="handleZSlider"
          :min="minValue"
          :max="maxValue"
          aria-label="Z"
        />
        <Input
          class="h-8 w-12 px-2 py-1"
          type="text"
          inputMode="decimal"
          :model-value="zInputValues[0] ?? ''"
          @update:modelValue="(next) => handleZInput(next, 0)"
          @blur="() => validateZ(zInputValues[0] ?? '', 0)"
          @keydown.enter.prevent="validateZ(zInputValues[0] ?? '', 0)"
          aria-label="Enter Z value"
        />
      </div>
    </div>

    <Button class="w-full" variant="outline" @click="resetAll">
      <RotateCcwIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />
      Reset
    </Button>
  </div>
</template>
