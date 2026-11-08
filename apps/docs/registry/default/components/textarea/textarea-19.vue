<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-19';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Autogrowing textarea</Label><Textarea @input="onDemoClick" :id="id" placeholder="Leave a comment" class="field-sizing-content max-h-29.5 min-h-0 resize-none py-1.75" /></div>
</template>
