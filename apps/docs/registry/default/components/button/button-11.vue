<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks">Button
      <ChevronDownIcon class="-me-1 opacity-60" :size="16" aria-hidden="true" /></Button>
</template>
