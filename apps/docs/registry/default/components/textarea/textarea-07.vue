<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-07';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with gray background</Label><Textarea @input="onDemoClick" @input="onDemoClick" :id="id" class="bg-muted border-transparent shadow-none" placeholder="Leave a comment" /></div>
</template>
