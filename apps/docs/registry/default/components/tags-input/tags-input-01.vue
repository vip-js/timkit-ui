<script setup lang="ts">
import { ref } from 'vue'
const tag = ref('design')
</script>
<template>
  <label class="text-sm">Tags
    <input class="mt-1 h-9 rounded-md border px-3" :value="tag" @input="tag = $event.target.value" />
  </label>
</template>
