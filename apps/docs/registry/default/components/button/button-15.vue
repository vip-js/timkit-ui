<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline" class="gap-3">Messages
      <span class="text-muted-foreground -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">18
      </span></Button>
</template>
