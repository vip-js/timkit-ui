<script setup lang="ts">
import { ref } from 'vue'
import { ToggleGroup } from '@timui/vue';
import { ToggleGroupItem } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <ToggleGroup @click="onDemoClick" variant="outline" class="inline-flex" type="single"><ToggleGroupItem value="left">Left</ToggleGroupItem><ToggleGroupItem value="center">Center</ToggleGroupItem><ToggleGroupItem value="right">Right</ToggleGroupItem></ToggleGroup>
</template>
