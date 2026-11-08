<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue'
import { Slider } from '@timui/vue'



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="space-y-4">
    <Label @click="onDemoClick">Progress threshold</Label>
    <Slider :default-value="[40]" aria-label="Progress threshold" />
  </div>
</template>
