<script setup lang="ts">
import { ref } from 'vue'
import TreeDemoBase from './tree-demo-base.vue'

const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <TreeDemoBase @click="onDemoClick" variant="caret-right" description="Basic tree with caret icon on the right" />
</template>
