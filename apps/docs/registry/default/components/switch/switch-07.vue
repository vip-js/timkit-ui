<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';





const id = 'switch-07';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch @click="onDemoClick" :id="id" class="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5" /><Label :htmlFor="id" class="sr-only">M3-style switch
      </Label></div>
</template>
