<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <div class="flex items-center justify-between gap-1">
        <Label for="input-04-id" class="leading-6">
          Input with hint
        </Label>
        <span class="text-muted-foreground text-sm">Optional</span>
      </div>
      <Input id="input-04-id" placeholder="Email" type="email" />
    </div>
</template>
