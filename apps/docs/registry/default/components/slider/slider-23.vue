<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSliderWithInput } from '@/registry/default/hooks/use-slider-with-input.vue';


</script>

<template>
  <div class="*:not-first:mt-4"><Label>Vertical slider with input</Label><div class="flex h-40 flex-col items-center justify-center gap-4"><Slider class="data-[orientation=vertical]:min-h-0" :value="sliderValue" @update:modelValue="handleSliderChange" :min="minValue" :max="maxValue" orientation="vertical" aria-label="Slider with input" /><Input class="h-8 w-12 px-2 py-1" type="text" inputMode="decimal" :value="inputValues[0]" :onChange="(e) => handleInputChange(e, 0)" :onBlur="() => validateAndUpdateValue(inputValues[0], 0)" :onKeyDown="(e) => {
            if (e.key === 'Enter') {
              validateAndUpdateValue(inputValues[0], 0)
            }
          }" aria-label="Enter value" /></div></div>
</template>
