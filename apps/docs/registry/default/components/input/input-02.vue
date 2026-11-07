<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-02';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Required input <span class="text-destructive">*</span></Label><Input @input="onDemoClick" @input="onDemoClick" :id="id" placeholder="Email" type="email" required /></div>
</template>
