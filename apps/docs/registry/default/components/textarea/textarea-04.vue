<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-04';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><div class="flex items-center justify-between gap-1"><Label :htmlFor="id" class="leading-6">Textarea with hint
        </Label><span class="text-muted-foreground text-sm">Optional</span></div><Textarea @input="onDemoClick" :id="id" placeholder="Leave a comment" /></div>
</template>
