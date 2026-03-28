<script setup lang="ts">
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';




</script>

<template>
  <div class="*:not-first:mt-4"><Label>Dual range slider</Label><Slider :default-value="[25, 75]" :step="10" aria-label="Dual range slider" /></div>
</template>
