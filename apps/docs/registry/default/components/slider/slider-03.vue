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
  <div class="*:not-first:mt-4"><Label @click="onDemoClick">Slider with square thumb</Label><Slider :default-value="[25]" :max="100" :step="10" class="[&>:last-child>span]:rounded" aria-label="Slider with square thumb" /></div>
</template>
