<script setup lang="ts">
import { ref } from 'vue'
import { Badge } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Badge @click="onDemoClick" variant="outline" class="gap-1"><svg class="text-emerald-500" :width="12" :height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>Badge
    </Badge>
</template>
