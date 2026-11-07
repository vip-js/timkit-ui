<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { SelectNative } from '@timui/vue';





const id = 'select-48';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Multiple select (native)</Label><div class="border-input overflow-hidden rounded-md border"><SelectNative @input="onDemoClick" @input="onDemoClick" :id="id" multiple class="rounded-none border-none"><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option><option value="5">Vue</option><option value="6">Angular</option></SelectNative></div></div>
</template>
