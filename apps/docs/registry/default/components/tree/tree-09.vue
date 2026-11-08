<script setup lang="ts">
import { ref } from 'vue'
import TreeDemoBase from './tree-demo-base.vue'



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <TreeDemoBase @click="onDemoClick" variant="double-click" description="Tree with items expandable on double click" />
</template>
