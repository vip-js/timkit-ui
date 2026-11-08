<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-30';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">File input</Label><Input @input="onDemoClick" :id="id" class="p-0 pe-3 file:me-3 file:border-0 file:border-e" type="file" /></div>
</template>
