<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-07';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with gray background (native)</Label><SelectNative @input="onDemoClick" @input="onDemoClick" :id="id" class="bg-muted border-transparent shadow-none"><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option></SelectNative></div>
</template>
