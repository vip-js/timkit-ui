<script setup lang="ts">
import { ref } from 'vue'
import { Bold, Italic, Underline } from 'lucide-vue-next';
import { ToggleGroup } from '@timui/vue';
import { ToggleGroupItem } from '@timui/vue';







const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <ToggleGroup @click="onDemoClick" type="multiple"><ToggleGroupItem value="bold" aria-label="Toggle bold"><Bold class="h-4 w-4" /></ToggleGroupItem><ToggleGroupItem value="italic" aria-label="Toggle italic"><Italic class="h-4 w-4" /></ToggleGroupItem><ToggleGroupItem value="underline" aria-label="Toggle underline"><Underline class="h-4 w-4" /></ToggleGroupItem></ToggleGroup>
</template>
