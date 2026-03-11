<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="*:not-first:mt-3"><Label class="tabular-nums">From {{ formatPrice(value[0]) }}to {{ formatPrice(value[1]) }}</Label><div class="flex items-center gap-4"><Slider :value="value" @update:modelValue="setValue" :min="min_price" :max="max_price" aria-label="Price range slider" /><Button variant="outline">Go</Button></div></div>
</template>
