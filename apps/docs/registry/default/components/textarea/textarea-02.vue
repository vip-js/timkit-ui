<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-02';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Required textarea <span class="text-destructive">*</span></Label><Textarea @input="onDemoClick" @input="onDemoClick" :id="id" placeholder="Leave a message" required /></div>
</template>
