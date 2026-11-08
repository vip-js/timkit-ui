<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue'
import { Switch } from '@timui/vue'



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <Switch @click="onDemoClick" id="docs-switch-demo" default-checked />
    <Label htmlFor="docs-switch-demo">Enable release preview</Label>
  </div>
</template>
