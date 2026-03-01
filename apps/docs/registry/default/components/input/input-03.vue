<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-03-id">Input with helper text</Label>
      <Input id="input-03-id" placeholder="Email" type="email" />
      <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        We won&lsquo;t share your email with anyone
      </p>
    </div>
</template>
