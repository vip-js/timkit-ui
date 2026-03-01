<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-34-id">Input with character limit</Label>
      <div class="relative">
        <Input id="input-34-id"
          class="peer pe-14"
          type="text" aria-describedby="input-34-id-description"
        />
        <div id="input-34-id"
          class="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-xs tabular-nums peer-disabled:opacity-50"
          aria-live="polite"
          role="status"
        >
          /
        </div>
      </div>
    </div>
</template>
