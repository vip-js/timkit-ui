<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Square } from '@/components/ui/square'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-39-id">Options with placeholder avatar</Label>
      <Select defaultValue="1">
        <SelectTrigger id="select-39-id"
          class="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0"
        >
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
          <SelectGroup>
            <SelectLabel class="ps-2">Impersonate user</SelectLabel>
            <SelectItem value="1">
              <Square class="bg-indigo-400/20 text-indigo-500">F</Square>
              <span class="truncate">Frank Morris</span>
            </SelectItem>
            <SelectItem value="2">
              <Square class="bg-purple-400/20 text-purple-500">X</Square>
              <span class="truncate">Xavier Guerra</span>
            </SelectItem>
            <SelectItem value="3">
              <Square class="bg-rose-400/20 text-rose-500">A</Square>
              <span class="truncate">Anne Kelley</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
</template>
