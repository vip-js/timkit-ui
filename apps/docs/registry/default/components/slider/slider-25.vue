<script setup lang="ts">
import { RotateCcwIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSliderWithInput } from '@/registry/default/hooks/use-slider-with-input.vue';


</script>

<template>
  <div class="space-y-4"><legend class="text-foreground text-sm font-medium">Object position</legend><div class="space-y-2"><SliderWithInput :minValue="-10" :maxValue="10" :initialValue="[-2]" :default-value="[0]" label="X" :onRegisterReset="(resetFn) => registerResetFunction(resetFn, 0)" /><SliderWithInput :minValue="-10" :maxValue="10" :initialValue="[4]" :default-value="[0]" label="Y" :onRegisterReset="(resetFn) => registerResetFunction(resetFn, 1)" /><SliderWithInput :minValue="-10" :maxValue="10" :initialValue="[2]" :default-value="[0]" label="Z" :onRegisterReset="(resetFn) => registerResetFunction(resetFn, 2)" /></div><Button class="w-full" variant="outline" @click="resetAll"><RotateCcwIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Reset
      </Button></div>
</template>
