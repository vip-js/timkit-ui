<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';





const id = 'switch-06';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch @click="onDemoClick" :id="id" class="[&_span]:border-input h-3 w-9 border-none outline-offset-[6px] [&_span]:border" /><Label :htmlFor="id" class="sr-only">M2-style switch
      </Label></div>
</template>
