<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeftIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" class="relative ps-12">Previous
      <span class="bg-primary-foreground/15 pointer-events-none absolute inset-y-0 start-0 flex w-9 items-center justify-center"><ChevronLeftIcon class="opacity-60" :size="16" aria-hidden="true" /></span></Button>
</template>
