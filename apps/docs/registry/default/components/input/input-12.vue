<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-12-id">Input with end inline add-on</Label>
      <div class="relative">
        <Input id="input-12-id" class="peer pe-12" placeholder="google" type="text" />
        <span class="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
          .com
        </span>
      </div>
    </div>
</template>
