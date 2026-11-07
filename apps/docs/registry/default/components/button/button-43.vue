<script setup lang="ts">
import { ref } from 'vue'
import { ThumbsUpIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';





const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <Button @click="onDemoClick" :data-clicks="demoClicks" class="py-0 pe-0" variant="outline"><ThumbsUpIcon class="opacity-60" :size="16" aria-hidden="true" />Like
      <span class="text-muted-foreground before:bg-input relative ms-1 inline-flex h-full items-center justify-center rounded-full px-3 text-xs font-medium before:absolute before:inset-0 before:left-0 before:w-px">86
      </span></Button>
</template>
