<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="*:not-first:mt-3"><Label>Rate your experience</Label><div class="flex items-center gap-2"><Slider :value="value" @update:modelValue="setValue" :min="1" :max="5" showTooltip :tooltipContent="(value) => labels[value - 1]" aria-label="Rate your experience" /><span class="text-2xl">{{ emojis[value[0] - 1] }}</span></div></div>
</template>
