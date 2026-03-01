<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-06-id">Input with error</Label>
      <Input id="input-06-id"
        class="peer"
        placeholder="Email"
        type="email"
        defaultValue="invalid@email.com"
        aria-invalid
      />
      <p
        class="peer-aria-invalid:text-destructive mt-2 text-xs"
        role="alert"
        aria-live="polite"
      >
        Email is invalid
      </p>
    </div>
</template>
