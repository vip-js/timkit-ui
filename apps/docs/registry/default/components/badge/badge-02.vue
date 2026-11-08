<script setup lang="ts">
import { ref } from 'vue'
import { Badge } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Badge @click="onDemoClick" class="rounded">Badge</Badge>
</template>
