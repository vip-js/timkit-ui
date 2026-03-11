<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSliderWithInput } from '@/registry/default/hooks/use-slider-with-input.vue';


</script>

<template>
  <div class="*:not-first:mt-4"><Label>Price slider</Label><div><div class="flex h-12 w-full items-end px-3" aria-hidden="true"><div v-for="(count, i) in itemCounts" :key="i" :key="i" class="flex flex-1 justify-center" :style="{
                height: `${(count / maxCount) * 100}%`,
              }"><span :data-selected="isBarInSelectedRange(i, minValue, priceStep, sliderValue)" class="bg-primary/20 size-full"></span></div></div><Slider :value="sliderValue" @update:modelValue="handleSliderValueChange" :min="minValue" :max="maxValue" aria-label="Price range" /></div><div class="flex items-center justify-between gap-4"><div class="*:not-first:mt-1"><Label :htmlFor="`${id}-min`">Min price</Label><div class="relative"><Input :id="`${id}-min`" class="peer w-full ps-6" type="text" inputMode="decimal" :value="inputValues[0]" :onChange="(e) => handleInputChange(e, 0)" :onBlur="() => validateAndUpdateValue(inputValues[0], 0)" :onKeyDown="(e) => {
                if (e.key === 'Enter') {
                  validateAndUpdateValue(inputValues[0], 0)
                }
              }" aria-label="Enter minimum price" /><span class="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">$
            </span></div></div><div class="*:not-first:mt-1"><Label :htmlFor="`${id}-max`">Max price</Label><div class="relative"><Input :id="`${id}-max`" class="peer w-full ps-6" type="text" inputMode="decimal" :value="inputValues[1]" :onChange="(e) => handleInputChange(e, 1)" :onBlur="() => validateAndUpdateValue(inputValues[1], 1)" :onKeyDown="(e) => {
                if (e.key === 'Enter') {
                  validateAndUpdateValue(inputValues[1], 1)
                }
              }" aria-label="Enter maximum price" /><span class="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">$
            </span></div></div></div><Button class="w-full" variant="outline">Show {{ countItemsInRange(sliderValue[0], sliderValue[1]) }}items
      </Button></div>
</template>
