<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="rounded border px-2 py-1 text-xs">
    <slot>{{ title || 'Draggable event placeholder' }}</slot>
  </div>
</template>
