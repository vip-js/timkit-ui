<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusDot } from '@/components/ui/status-dot'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-32-id">Status select</Label>
      <Select defaultValue="1">
        <SelectTrigger id="select-32-id"
          class="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
        >
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent class="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
          <SelectItem value="1">
            <span class="flex items-center gap-2">
              <StatusDot class="text-emerald-600" />
              <span class="truncate">Completed</span>
            </span>
          </SelectItem>
          <SelectItem value="2">
            <span class="flex items-center gap-2">
              <StatusDot class="text-blue-500" />
              <span class="truncate">In Progress</span>
            </span>
          </SelectItem>
          <SelectItem value="3">
            <span class="flex items-center gap-2">
              <StatusDot class="text-amber-500" />
              <span class="truncate">Pending</span>
            </span>
          </SelectItem>
          <SelectItem value="4">
            <span class="flex items-center gap-2">
              <StatusDot class="text-gray-500" />
              <span class="truncate">Cancelled</span>
            </span>
          </SelectItem>
          <SelectItem value="5">
            <span class="flex items-center gap-2">
              <StatusDot class="text-red-500" />
              <span class="truncate">Failed</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
</template>
