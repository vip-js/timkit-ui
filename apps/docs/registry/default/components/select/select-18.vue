<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';





const id = 'select-18';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with helper text</Label><Select default-value="3"><SelectTrigger @click="onDemoClick" :id="id"><SelectValue placeholder="Select framework" /></SelectTrigger><SelectContent><SelectItem value="1">React</SelectItem><SelectItem value="2">Next.js</SelectItem><SelectItem value="3">Astro</SelectItem><SelectItem value="4">Gatsby</SelectItem></SelectContent></Select><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Tell us what&lsquo;s your favorite Select framework
      </p></div>
</template>
