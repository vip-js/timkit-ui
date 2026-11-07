<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="inline-flex items-center gap-2"><Button @click="onDemoClick" :data-clicks="demoClicks" variant="ghost">Cancel</Button><Button>Save</Button></div>
</template>
