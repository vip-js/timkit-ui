<script setup lang="ts">
import { ref } from 'vue'
import { Badge } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Badge @click="onDemoClick" class="items-baseline gap-1.5">Badge
      <span class="text-primary-foreground/60 text-[0.625rem] font-medium">73</span></Badge>
</template>
