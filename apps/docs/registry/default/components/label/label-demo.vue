<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div><div class="flex items-center space-x-2"><Checkbox @click="onDemoClick" id="terms" /><Label htmlFor="terms">Accept terms and conditions</Label></div></div>
</template>
