<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-03';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with helper text</Label><Textarea @input="onDemoClick" :id="id" placeholder="Leave a comment" /><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Please add as many details as you can
      </p></div>
</template>
