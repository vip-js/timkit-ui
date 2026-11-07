<script setup lang="ts">
import { ref } from 'vue'
import { SelectNative } from '@timui/vue';





const id = 'select-13';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="group relative"><label :for="id" class="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-[select:disabled]:opacity-50">Select with overlapping label (native)
      </label><SelectNative @input="onDemoClick" @input="onDemoClick" :id="id" default-value=""><option value="" disabled>Select framework
        </option><option value="1">React</option><option value="2">Next.js</option><option value="3">Astro</option><option value="4">Gatsby</option></SelectNative></div>
</template>
