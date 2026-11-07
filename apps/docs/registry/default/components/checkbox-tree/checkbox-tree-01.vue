<script setup lang="ts">
import { ref } from 'vue'
const checked = ref(false)
</script>
<template>
  <label class="flex items-center gap-2"><input type="checkbox" v-model="checked" /> All</label>
</template>
