<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="space-y-4"><div class="flex items-center justify-between gap-2"><Label class="leading-6">Slider with output</Label><output class="text-sm font-medium tabular-nums">{{ value[0] }}</output></div><Slider :value="value" @update:modelValue="setValue" aria-label="Slider with output" /></div>
</template>
