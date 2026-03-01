<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-35-id">Input with characters left</Label>
      <Input id="input-35-id"
        type="text" aria-describedby="input-35-id-description"
      />
      <p id="input-35-id"
        class="text-muted-foreground mt-2 text-xs"
        role="status"
        aria-live="polite"
      >
        <span class="tabular-nums"></span> characters left
      </p>
    </div>
</template>
