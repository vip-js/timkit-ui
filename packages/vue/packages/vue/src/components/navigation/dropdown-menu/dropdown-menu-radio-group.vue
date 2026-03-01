<script setup lang="ts">
const props = defineProps<Record<string, unknown>>()
</script>

<template>
  <div v-bind="props" data-slot="dropdown-menu-radio-group">
    <slot />
  </div>
</template>
