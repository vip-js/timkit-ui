<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue';
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-22';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Input with button</Label><div class="flex gap-2"><Input @input="onDemoClick" :id="id" class="flex-1" placeholder="Email" type="email" /><Button :data-clicks="demoClicks" variant="outline">Send</Button></div></div>
</template>
