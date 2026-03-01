<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-30-id">File input</Label>
      <Input id="input-30-id" class="p-0 pe-3 file:me-3 file:border-0 file:border-e" type="file" />
    </div>
</template>
