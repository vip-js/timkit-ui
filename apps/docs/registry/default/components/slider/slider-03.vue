<script setup lang="ts">
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';



</script>

<template>
  <div class="*:not-first:mt-4"><Label>Slider with square thumb</Label><Slider :default-value="[25]" :max="100" :step="10" class="[&>:last-child>span]:rounded" aria-label="Slider with square thumb" /></div>
</template>
