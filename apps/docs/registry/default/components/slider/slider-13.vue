<script setup lang="ts">
import { Volume2Icon, VolumeXIcon } from 'lucide-vue-next';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="space-y-3"><div class="flex items-center justify-between gap-2"><Label class="leading-6">Volume</Label><output class="text-sm font-medium tabular-nums">{{ value[0] }}</output></div><div class="flex items-center gap-2"><VolumeXIcon class="shrink-0 opacity-60" :size="16" aria-hidden="true" /><Slider :value="value" @update:modelValue="setValue" aria-label="Volume slider" /><Volume2Icon class="shrink-0 opacity-60" :size="16" aria-hidden="true" /></div></div>
</template>
