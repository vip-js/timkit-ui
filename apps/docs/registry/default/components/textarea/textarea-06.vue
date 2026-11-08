<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-06';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with error</Label><Textarea @input="onDemoClick" :id="id" placeholder="Leave a comment" default-value="Hello!" aria-invalid /><p class="text-destructive mt-2 text-xs" role="alert" aria-live="polite">Message should be at least 10 characters
      </p></div>
</template>
