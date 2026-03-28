<script setup lang="ts">
import { cn } from '@timui/core'
import { Label } from '@timui/vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@timui/vue'

const id = 'select-39'
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Options with placeholder avatar</Label>
    <Select default-value="1">
      <SelectTrigger :id="id" class="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0">
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent class="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
        <SelectGroup>
          <SelectLabel class="ps-2">Impersonate user</SelectLabel>
          <SelectItem value="1">
            <span :class="cn('bg-muted text-muted-foreground flex size-5 items-center justify-center rounded text-xs font-medium', 'bg-indigo-400/20 text-indigo-500')" data-square aria-hidden="true">F</span>
            <span class="truncate">Frank Morris</span>
          </SelectItem>
          <SelectItem value="2">
            <span :class="cn('bg-muted text-muted-foreground flex size-5 items-center justify-center rounded text-xs font-medium', 'bg-purple-400/20 text-purple-500')" data-square aria-hidden="true">X</span>
            <span class="truncate">Xavier Guerra</span>
          </SelectItem>
          <SelectItem value="3">
            <span :class="cn('bg-muted text-muted-foreground flex size-5 items-center justify-center rounded text-xs font-medium', 'bg-rose-400/20 text-rose-500')" data-square aria-hidden="true">A</span>
            <span class="truncate">Anne Kelley</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>
