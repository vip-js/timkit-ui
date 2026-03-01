<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-09-id">
        Required select (native) <span class="text-destructive">*</span>
      </Label>
      <SelectNative id="select-09-id">
        <option value="1">React</option>
        <option value="2">Next.js</option>
        <option value="3">Astro</option>
        <option value="4">Gatsby</option>
      </SelectNative>
    </div>
</template>
