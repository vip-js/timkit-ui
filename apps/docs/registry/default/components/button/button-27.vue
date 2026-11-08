<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse"><Button @click="onDemoClick" :data-clicks="demoClicks" class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" variant="outline" size="icon" aria-label="Upvote"><ChevronUpIcon :size="16" aria-hidden="true" /></Button><span class="border-input flex items-center border px-3 text-sm font-medium">235</span><Button class="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10" variant="outline" size="icon" aria-label="Downvote"><ChevronDownIcon :size="16" aria-hidden="true" /></Button></div>
</template>
