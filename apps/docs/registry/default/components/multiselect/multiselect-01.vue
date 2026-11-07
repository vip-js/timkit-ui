<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')
</script>
<template>
  <label class="text-sm">Skills
    <select class="mt-1 h-9 w-full rounded-md border px-3" multiple v-model="value">
      <option value="design">Design</option>
      <option value="code">Code</option>
    </select>
  </label>
</template>
