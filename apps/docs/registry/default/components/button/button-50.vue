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
  <Button @click="onDemoClick" :data-clicks="demoClicks" variant="link" class="gap-1"><ChevronLeftIcon class="opacity-60" :size="16" aria-hidden="true" />Go back
    </Button>
</template>
