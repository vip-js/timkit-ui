<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';





const id = 'select-19';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]"><Label :htmlFor="id">Select with colored border and ring</Label><Select default-value="1"><SelectTrigger @click="onDemoClick" :id="id"><SelectValue placeholder="Select framework" /></SelectTrigger><SelectContent><SelectItem value="1">React</SelectItem><SelectItem value="2">Next.js</SelectItem><SelectItem value="3">Astro</SelectItem><SelectItem value="4">Gatsby</SelectItem></SelectContent></Select></div>
</template>
