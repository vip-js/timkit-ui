<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-01';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="flex items-center gap-2"><Checkbox @click="onDemoClick" :id="id" /><Label :htmlFor="id">Simple checkbox</Label></div>
</template>
