<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="*:not-first:mt-4"><Label>Vertical slider</Label><div class="flex h-40 justify-center"><Slider :default-value="[5]" :max="10" orientation="vertical" aria-label="Vertical slider" /></div></div>
</template>
