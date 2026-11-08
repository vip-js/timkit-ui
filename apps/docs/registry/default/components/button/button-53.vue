<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, CircleIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="inline-grid w-fit grid-cols-3 gap-1"><Button @click="onDemoClick" :data-clicks="demoClicks" class="col-start-2" variant="outline" size="icon" aria-label="Pan camera up"><ChevronUpIcon :size="16" aria-hidden="true" /></Button><Button class="col-start-1" variant="outline" size="icon" aria-label="Pan camera left"><ChevronLeftIcon :size="16" aria-hidden="true" /></Button><div class="flex items-center justify-center" aria-hidden="true"><CircleIcon class="opacity-60" :size="16" /></div><Button variant="outline" size="icon" aria-label="Pan camera right"><ChevronRightIcon :size="16" aria-hidden="true" /></Button><Button class="col-start-2" variant="outline" size="icon" aria-label="Pan camera down"><ChevronDownIcon :size="16" aria-hidden="true" /></Button></div>
</template>
