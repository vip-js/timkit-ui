<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-24-id">Input with clear button</Label>
      <div class="relative">
        <Input id="input-24-id"
          class="pe-9"
          placeholder="Type something..."
          type="text" />
        
      </div>
    </div>
</template>
