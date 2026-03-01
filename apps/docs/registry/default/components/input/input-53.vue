<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-53-id">Read-only input</Label>
      <Input id="input-53-id"
        class="read-only:bg-muted"
        defaultValue="This is a read-only input"
        readOnly
        placeholder="Email"
        type="email"
      />
    </div>
</template>
