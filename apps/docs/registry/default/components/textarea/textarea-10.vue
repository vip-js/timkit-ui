<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue';
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-10';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with left button</Label><Textarea :id="id" placeholder="Leave a comment" /><Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline">Send</Button></div>
</template>
