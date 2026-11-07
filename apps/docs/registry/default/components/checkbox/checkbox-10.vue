<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'checkbox-10';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="flex items-center justify-between gap-2"><Checkbox @click="onDemoClick" :id="id" class="order-1" /><Label :htmlFor="id">Right aligned checkbox</Label></div>
</template>
