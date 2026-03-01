<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-04-id">Select with helper text (native)</Label>
      <SelectNative id="select-04-id">
        <option value="1">React</option>
        <option value="2">Next.js</option>
        <option value="3">Astro</option>
        <option value="4">Gatsby</option>
      </SelectNative>
      <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Tell us what&lsquo;s your favorite Select framework
      </p>
    </div>
</template>
