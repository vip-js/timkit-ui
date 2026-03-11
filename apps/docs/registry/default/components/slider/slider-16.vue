<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSliderWithInput } from '@/registry/default/hooks/use-slider-with-input.vue';


</script>

<template>
  <div class="*:not-first:mt-3"><Label>Slider with input</Label><div class="flex items-center gap-4"><Slider class="grow" :value="sliderValue" @update:modelValue="handleSliderChange" :min="minValue" :max="maxValue" aria-label="Slider with input" /><Input class="h-8 w-12 px-2 py-1" type="text" inputMode="decimal" :value="inputValues[0]" :onChange="(e) => handleInputChange(e, 0)" :onBlur="() => validateAndUpdateValue(inputValues[0], 0)" :onKeyDown="(e) => {
            if (e.key === 'Enter') {
              validateAndUpdateValue(inputValues[0], 0)
            }
          }" aria-label="Enter value" /></div></div>
</template>
