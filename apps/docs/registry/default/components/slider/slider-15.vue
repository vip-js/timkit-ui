<script setup lang="ts">
import { cn } from '@/lib/utils';
import { RotateCcwIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent } from '@/components/ui/tooltip-content';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import { TooltipTrigger } from '@/components/ui/tooltip-trigger';
import { useSliderWithInput } from '@/registry/default/hooks/use-slider-with-input.vue';


</script>

<template>
  <div class="space-y-3"><div class="flex items-center justify-between gap-2"><Label>Temperature</Label><div class="flex items-center gap-1"><TooltipProvider :delayDuration="0"><Tooltip><TooltipTrigger as-child><Button size="icon" variant="ghost" :class="cn(
                    'size-7 transition-opacity',
                    showReset ? 'opacity-100' : 'opacity-0'
                  )" aria-label="Reset" @click="resetToDefault"><RotateCcwIcon :size="16" aria-hidden="true" /></Button></TooltipTrigger><TooltipContent class="px-2 py-1 text-xs">Reset to default</TooltipContent></Tooltip></TooltipProvider><Input class="h-7 w-12 px-2 py-0" type="text" inputMode="decimal" :value="inputValues[0]" :onChange="(e) => handleInputChange(e, 0)" :onBlur="() => validateAndUpdateValue(inputValues[0] ?? '', 0)" :onKeyDown="(e) => {
              if (e.key === 'Enter') {
                validateAndUpdateValue(inputValues[0] ?? '', 0)
              }
            }" aria-label="Enter value" /></div></div><div class="flex items-center gap-4"><Slider class="grow" :value="sliderValue" @update:modelValue="handleSliderChange" :min="minValue" :max="maxValue" :step="0.01" aria-label="Temperature" /></div></div>
</template>
