<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRightIcon, MailIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" class="group" variant="secondary"><MailIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Email
      <ArrowRightIcon class="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5" :size="16" aria-hidden="true" /></Button>
</template>
