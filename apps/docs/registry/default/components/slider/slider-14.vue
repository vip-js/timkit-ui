<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="*:not-first:mt-4"><Label>Slider with multiple thumbs</Label><Slider :default-value="[25, 50, 100]" aria-label="Slider with multiple thumbs" showTooltip :tooltipContent="(value) => `${value}%`" /></div>
</template>
