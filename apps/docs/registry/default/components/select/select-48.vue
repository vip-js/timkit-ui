<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-48-id">Multiple select (native)</Label>
      <div class="border-input overflow-hidden rounded-md border">
        <SelectNative id="select-48-id" multiple class="rounded-none border-none">
          <option value="1">React</option>
          <option value="2">Next.js</option>
          <option value="3">Astro</option>
          <option value="4">Gatsby</option>
          <option value="5">Vue</option>
          <option value="6">Angular</option>
        </SelectNative>
      </div>
    </div>
</template>
