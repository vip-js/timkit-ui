<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-01-id">Simple input</Label>
      <Input id="input-01-id" placeholder="Email" type="email" />
    </div>
</template>
