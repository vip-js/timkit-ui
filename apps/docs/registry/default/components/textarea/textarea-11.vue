<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue';
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-11';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with right button</Label><Textarea :id="id" placeholder="Leave a comment" /><div class="flex justify-end"><Button @click="onDemoClick" :data-clicks="demoClicks" variant="outline">Send</Button></div></div>
</template>
