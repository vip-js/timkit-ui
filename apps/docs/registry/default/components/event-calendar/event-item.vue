<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="rounded border px-3 py-2 text-sm">
    <slot>{{ title || 'Event item placeholder' }}</slot>
  </div>
</template>
