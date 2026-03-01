<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-27-id">Select with disabled options</Label>
      <Select defaultValue="2">
        <SelectTrigger id="select-27-id">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1" disabled>
            React
          </SelectItem>
          <SelectItem value="2">Next.js</SelectItem>
          <SelectItem value="3" disabled>
            Astro
          </SelectItem>
          <SelectItem value="4">Gatsby</SelectItem>
        </SelectContent>
      </Select>
    </div>
</template>
