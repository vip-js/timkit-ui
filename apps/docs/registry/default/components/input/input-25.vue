<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-25-id">Search input with &lt;kbd&gt;</Label>
      <div class="relative">
        <Input id="input-25-id" class="pe-11" placeholder="Search..." type="search" />
        <div class="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
          <kbd class="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            ⌘K
          </kbd>
        </div>
      </div>
    </div>
</template>
