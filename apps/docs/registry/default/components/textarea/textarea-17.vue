<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-17';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with no resize</Label><Textarea @input="onDemoClick" :id="id" class="[resize:none]" placeholder="Leave a comment" /></div>
</template>
