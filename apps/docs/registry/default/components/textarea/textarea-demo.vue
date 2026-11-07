<script setup lang="ts">
import { ref } from 'vue'
import { Textarea } from '@timui/vue'

const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">Release notes</label>
    <Textarea @input="onDemoClick" @input="onDemoClick" placeholder="Summarize parity updates and adapter coverage..." class="min-h-32" />
  </div>
</template>
