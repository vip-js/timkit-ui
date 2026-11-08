<script setup lang="ts">
import { ref } from 'vue'
import { LoaderCircleIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" disabled><LoaderCircleIcon class="-ms-1 animate-spin" :size="16" aria-hidden="true" />Button
    </Button>
</template>
