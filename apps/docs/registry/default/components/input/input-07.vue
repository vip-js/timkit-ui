<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-07-id">Input with gray background</Label>
      <Input id="input-07-id"
        class="bg-muted border-transparent shadow-none"
        placeholder="Email"
        type="email"
      />
    </div>
</template>
