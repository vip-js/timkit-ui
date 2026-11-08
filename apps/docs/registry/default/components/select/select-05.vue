<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-05';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]"><Label :htmlFor="id">Select with colored border (native)</Label><SelectNative @input="onDemoClick" :id="id"><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option></SelectNative></div>
</template>
