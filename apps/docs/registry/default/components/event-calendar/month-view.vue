<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="text-muted-foreground p-4 text-sm">
    <slot>{{ title || 'Month view placeholder' }}</slot>
  </div>
</template>
