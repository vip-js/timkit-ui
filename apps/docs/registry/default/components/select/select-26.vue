<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-26-id">Select with separator</Label>
      <Select defaultValue="1">
        <SelectTrigger id="select-26-id">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frontend</SelectLabel>
            <SelectItem value="1">React</SelectItem>
            <SelectItem value="2">Vue</SelectItem>
            <SelectItem value="3">Angular</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Backend</SelectLabel>
            <SelectItem value="4">Node.js</SelectItem>
            <SelectItem value="5">Python</SelectItem>
            <SelectItem value="6">Java</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
</template>
