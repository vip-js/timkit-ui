<script setup lang="ts">
import { cn } from '@timui/core';
import { RotateCcwIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';
import { Tooltip } from '@timui/vue';
import { TooltipContent } from '@timui/vue';
import { TooltipProvider } from '@timui/vue';
import { TooltipTrigger } from '@timui/vue';
import { useSliderWithInput } from '@/registry/default/hooks/use-slider-with-input-vue';

const minValue = 0;
const maxValue = 2;
const initialValue = [1.25];
const defaultValue = [1];

const {
  sliderValue,
  inputValues,
  validateAndUpdateValue,
  handleInputChange,
  handleSliderChange,
  resetToDefault,
  showReset,
} = useSliderWithInput({ minValue, maxValue, initialValue, defaultValue });
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-2">
      <Label>Temperature</Label>
      <div class="flex items-center gap-1">
        <TooltipProvider :delayDuration="0">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                size="icon"
                variant="ghost"
                :class="cn('size-7 transition-opacity', showReset ? 'opacity-100' : 'opacity-0')"
                aria-label="Reset"
                @click="resetToDefault"
              >
                <RotateCcwIcon :size="16" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent class="px-2 py-1 text-xs">Reset to default</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input
          class="h-7 w-12 px-2 py-0"
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
    <div class="flex items-center gap-4">
      <Slider
        class="grow"
        :value="sliderValue"
        @update:modelValue="handleSliderChange"
        :min="minValue"
        :max="maxValue"
        :step="0.01"
        aria-label="Temperature"
      />
    </div>
  </div>
</template>
