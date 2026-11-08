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
  <div class="*:not-first:mt-4"><Label @click="onDemoClick">Simple slider</Label><Slider id="volume" :default-value="[25]" /></div>
</template>
