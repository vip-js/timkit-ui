<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-11-id">Input with start inline add-on</Label>
      <div class="relative">
        <Input id="input-11-id" class="peer ps-16" placeholder="google.com" type="text" />
        <span class="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
          https://
        </span>
      </div>
    </div>
</template>
