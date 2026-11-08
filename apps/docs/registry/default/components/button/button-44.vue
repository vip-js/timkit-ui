<script setup lang="ts">
import { ref } from 'vue'
import { StarIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks"><StarIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" /><span class="flex items-baseline gap-2">Star
        <span class="text-primary-foreground/60 text-xs">729</span></span></Button>
</template>
