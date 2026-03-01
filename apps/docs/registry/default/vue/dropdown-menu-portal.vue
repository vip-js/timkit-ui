<script setup lang="ts">
const props = defineProps<{ to?: string }>()
</script>

<template>
  <Teleport :to="props.to || 'body'">
    <slot />
  </Teleport>
</template>
