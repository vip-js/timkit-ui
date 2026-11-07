<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Textarea } from '@timui/vue';





const id = 'textarea-18';


const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Read-only textarea</Label><Textarea @input="onDemoClick" @input="onDemoClick" :id="id" class="read-only:bg-muted" default-value="This is a read-only textarea" readOnly placeholder="Leave a comment" /></div>
</template>
