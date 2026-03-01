<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-08-id">Disabled input</Label>
      <Input id="input-08-id" placeholder="Email" type="email" disabled />
    </div>
</template>
