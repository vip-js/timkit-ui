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
  <div class="*:not-first:mt-4"><Label @click="onDemoClick">Vertical slider</Label><div class="flex h-40 justify-center"><Slider :default-value="[5]" :max="10" orientation="vertical" aria-label="Vertical slider" /></div></div>
</template>
