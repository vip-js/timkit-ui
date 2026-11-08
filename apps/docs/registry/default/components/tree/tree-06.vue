<script setup lang="ts">
import { ref } from 'vue'
import TreeDemoBase from './tree-demo-base.vue'



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <TreeDemoBase @click="onDemoClick" variant="renaming" description="Tree with renaming (press F2 to rename)" />
</template>
