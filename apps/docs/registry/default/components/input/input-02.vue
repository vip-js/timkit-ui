<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-02-id">
        Required input <span class="text-destructive">*</span>
      </Label>
      <Input id="input-02-id" placeholder="Email" type="email" required />
    </div>
</template>
