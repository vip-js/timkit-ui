<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-15-id">Input with end add-on</Label>
      <div class="flex rounded-md shadow-xs">
        <Input id="input-15-id"
          class="-me-px rounded-e-none shadow-none"
          placeholder="google"
          type="text"
        />
        <span class="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
          .com
        </span>
      </div>
    </div>
</template>
