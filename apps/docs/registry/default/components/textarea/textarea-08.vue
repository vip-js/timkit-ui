<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-08';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Shorter textarea</Label><Textarea @input="onDemoClick" @input="onDemoClick" :id="id" class="min-h-0" placeholder="Leave a comment" :rows="2" /></div>
</template>
