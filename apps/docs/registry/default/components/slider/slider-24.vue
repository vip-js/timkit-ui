<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="*:not-first:mt-4"><Label>Vertical dual range slider and tooltip</Label><div class="flex h-40 justify-center"><Slider :default-value="[2, 7]" :max="10" orientation="vertical" aria-label="Vertical slider" showTooltip /></div></div>
</template>
