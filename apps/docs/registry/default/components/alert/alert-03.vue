<script setup lang="ts">
import { Alert, AlertDescription } from '@/components/ui/alert'
</script>

<template>
<Alert class="rounded-md border px-4 py-3">
  <div class="flex gap-3">
    <span class="me-3 -mt-0.5 inline-flex text-red-500" aria-hidden="true">!</span>
    <AlertDescription class="text-sm text-current">An error occurred!</AlertDescription>
  </div>
</Alert>
</template>
