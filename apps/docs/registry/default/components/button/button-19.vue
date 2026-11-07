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
  <Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline" class="aspect-square max-sm:p-0"><PlusIcon class="opacity-60 sm:-ms-1" :size="16" aria-hidden="true" /><span class="max-sm:sr-only">Add new</span></Button>
</template>
