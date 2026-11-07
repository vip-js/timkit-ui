<script setup lang="ts">
import { ref } from 'vue'
import { PlusIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" class="rounded-full" variant="outline" size="icon" aria-label="Add new item"><PlusIcon :size="16" aria-hidden="true" /></Button>
</template>
