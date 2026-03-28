<script setup lang="ts">
import { Label } from '@timui/vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@timui/vue'

const id = 'select-32'
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label :htmlFor="id">Status select</Label>
    <Select default-value="1">
      <SelectTrigger :id="id" class="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
        <SelectItem value="1">
          <span class="flex items-center gap-2">
            <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8" class="text-emerald-600" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
            <span class="truncate">Completed</span>
          </span>
        </SelectItem>
        <SelectItem value="2">
          <span class="flex items-center gap-2">
            <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8" class="text-blue-500" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
            <span class="truncate">In Progress</span>
          </span>
        </SelectItem>
        <SelectItem value="3">
          <span class="flex items-center gap-2">
            <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8" class="text-amber-500" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
            <span class="truncate">Pending</span>
          </span>
        </SelectItem>
        <SelectItem value="4">
          <span class="flex items-center gap-2">
            <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8" class="text-gray-500" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
            <span class="truncate">Cancelled</span>
          </span>
        </SelectItem>
        <SelectItem value="5">
          <span class="flex items-center gap-2">
            <svg width="8" height="8" fill="currentColor" viewBox="0 0 8 8" class="text-red-500" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>
            <span class="truncate">Failed</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
