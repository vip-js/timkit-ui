<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-33-id">Select with left text</Label>
      <Select defaultValue="1">
        <SelectTrigger id="select-33-id">
          <span>
            Language: <SelectValue placeholder="Select a language" />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Javascript</SelectItem>
          <SelectItem value="2">Bash</SelectItem>
        </SelectContent>
      </Select>
    </div>
</template>
