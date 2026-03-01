<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="[--ring:var(--color-indigo-300)] *:not-first:mt-2 in-[.dark]:[--ring:var(--color-indigo-900)]">
        <Label for="input-05-id">Input with colored border and ring</Label>
        <Input id="input-05-id" placeholder="Email" type="email" />
      </div>
</template>
