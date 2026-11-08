<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-03';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with helper text</Label><Input @input="onDemoClick" :id="id" placeholder="Email" type="email" /><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">We won&lsquo;t share your email with anyone
      </p></div>
</template>
