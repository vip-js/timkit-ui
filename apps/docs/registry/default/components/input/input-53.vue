<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@timui/vue';
import { Label } from '@timui/vue';





const id = 'input-53';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Read-only input</Label><Input @input="onDemoClick" :id="id" class="read-only:bg-muted" default-value="This is a read-only input" readOnly placeholder="Email" type="email" /></div>
</template>
