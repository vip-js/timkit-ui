<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
function onDemoClick() { value.value = value.value === 'Apple' ? 'Orange' : 'Apple' }
</script>
<template>
  <label class="text-sm">Fruit
    <input class="mt-1 flex h-9 w-full rounded-md border px-3" :value="value" @input="onDemoClick" />
  </label>
</template>
