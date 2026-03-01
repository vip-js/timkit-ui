<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-10-id">Select with auto-width (native)</Label>
      <div class="w-fit">
        <SelectNative id="select-10-id">
          <option value="1">React</option>
          <option value="2">Next.js</option>
          <option value="3">Astro</option>
          <option value="4">Gatsby</option>
        </SelectNative>
      </div>
    </div>
</template>
