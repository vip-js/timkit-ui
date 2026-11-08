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
  <div class="*:not-first:mt-4"><Label @click="onDemoClick">Slider with labels and tooltip</Label><div><span class="text-muted-foreground mb-3 flex w-full items-center justify-between gap-2 text-xs font-medium" aria-hidden="true"><span>Low</span><span>High</span></span><Slider :default-value="[50]" :step="10" :showTooltip="true" aria-label="Slider with labels and tooltip" /></div></div>
</template>
