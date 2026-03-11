<script setup lang="ts">
import { MinusIcon, PlusIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="*:not-first:mt-3"><Label class="tabular-nums">{{ value[0] }}credits/mo</Label><div class="flex items-center gap-4"><div><Button variant="outline" size="icon" class="size-8" aria-label="Decrease value" @click="decreaseValue" :disabled="value[0] === 0"><MinusIcon :size="16" aria-hidden="true" /></Button></div><Slider class="grow" :value="value" @update:modelValue="setValue" :min="minValue" :max="maxValue" :step="steps" aria-label="Dual range slider with buttons" /><div><Button variant="outline" size="icon" class="size-8" aria-label="Increase value" @click="increaseValue" :disabled="value[0] === 200"><PlusIcon :size="16" aria-hidden="true" /></Button></div></div></div>
</template>
