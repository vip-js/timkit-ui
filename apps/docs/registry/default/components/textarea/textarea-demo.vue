<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">Release notes</label>
    <Textarea placeholder="Summarize parity updates and adapter coverage..." class="min-h-32" />
  </div>
</template>
