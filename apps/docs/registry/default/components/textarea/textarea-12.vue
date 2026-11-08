<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@timui/vue';
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-12';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Textarea with button</Label><Textarea @input="onDemoClick" :id="id" placeholder="Leave a comment" /><Button :data-clicks="demoClicks" variant="outline" class="w-full">Send
      </Button></div>
</template>
