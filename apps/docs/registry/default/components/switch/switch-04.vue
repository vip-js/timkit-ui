<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Switch } from '@timui/vue';





const id = 'switch-04';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="inline-flex items-center gap-2"><Switch @click="onDemoClick" :id="id" disabled /><Label :htmlFor="id" class="sr-only">Disabled
      </Label></div>
</template>
