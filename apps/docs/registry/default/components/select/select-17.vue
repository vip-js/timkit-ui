<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-17-id">Select with icon</Label>
      <Select defaultValue="1">
        <SelectTrigger id="select-17-id" class="relative ps-9">
          <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 group-has-[select[disabled]]:opacity-50">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <SelectValue placeholder="Select time" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">00:00 AM - 11:59 PM</SelectItem>
          <SelectItem value="2">01:00 AM - 12:59 PM</SelectItem>
          <SelectItem value="3">02:00 AM - 01:59 PM</SelectItem>
          <SelectItem value="4">03:00 AM - 02:59 PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
</template>
