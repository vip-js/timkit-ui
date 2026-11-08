<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-07';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with gray background</Label><Input @input="onDemoClick" :id="id" class="bg-muted border-transparent shadow-none" placeholder="Email" type="email" /></div>
</template>
