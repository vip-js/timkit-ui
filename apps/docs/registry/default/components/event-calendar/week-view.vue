<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="text-muted-foreground p-4 text-sm">
    <slot>{{ title || 'Week view placeholder' }}</slot>
  </div>
</template>
