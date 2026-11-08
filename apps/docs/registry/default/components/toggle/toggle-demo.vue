<script setup lang="ts">
import { ref } from 'vue'
import { Bold } from 'lucide-vue-next';
import { Toggle } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Toggle @click="onDemoClick" aria-label="Toggle bold"><Bold class="h-4 w-4" /></Toggle>
</template>
