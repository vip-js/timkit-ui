<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-20-id">Select with error</Label>
      <Select defaultValue="1">
        <SelectTrigger id="select-20-id" aria-invalid>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">React</SelectItem>
          <SelectItem value="2">Next.js</SelectItem>
          <SelectItem value="3">Astro</SelectItem>
          <SelectItem value="4">Gatsby</SelectItem>
        </SelectContent>
      </Select>
      <p class="text-destructive mt-2 text-xs" role="alert" aria-live="polite">
        Selected option is invalid
      </p>
    </div>
</template>
