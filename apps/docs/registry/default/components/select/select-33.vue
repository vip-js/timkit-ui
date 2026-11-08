<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@timui/vue';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue';





const id = 'select-33';




const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <div class="*:not-first:mt-2"><Label :htmlFor="id">Select with left text</Label><Select default-value="1"><SelectTrigger @click="onDemoClick" :id="id"><span>Language: <SelectValue placeholder="Select a language" /></span></SelectTrigger><SelectContent><SelectItem value="1">Javascript</SelectItem><SelectItem value="2">Bash</SelectItem></SelectContent></Select></div>
</template>
