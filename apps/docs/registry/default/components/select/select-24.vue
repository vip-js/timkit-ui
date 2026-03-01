<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-24-id">Select with auto-width</Label>
      <Select defaultValue="1">
        
        <SelectTrigger id="select-24-id" class="w-auto max-w-full min-w-48">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">React</SelectItem>
          <SelectItem value="2">Next.js</SelectItem>
          <SelectItem value="3">Astro</SelectItem>
          <SelectItem value="4">Gatsby</SelectItem>
        </SelectContent>
      </Select>
    </div>
</template>
