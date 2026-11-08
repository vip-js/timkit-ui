<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Slider } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-4"><Label @click="onDemoClick">Slider with multiple thumbs</Label><Slider :default-value="[25, 50, 100]" aria-label="Slider with multiple thumbs" showTooltip :tooltipContent="(value) => `${value}%`" /></div>
</template>
