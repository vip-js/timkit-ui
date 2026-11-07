<script setup lang="ts">
import { ref } from 'vue'
import { PrinterIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline"><PrinterIcon class="-ms-1 opacity-60" :size="16" aria-hidden="true" />Print
      <kbd class="bg-background text-muted-foreground/70 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">⌘P
      </kbd></Button>
</template>
