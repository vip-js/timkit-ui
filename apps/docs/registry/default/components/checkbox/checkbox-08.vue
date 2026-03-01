<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="flex gap-6">
      <div class="flex items-center gap-2">
        <Checkbox id="checkbox-08-id" />
        <Label for="checkbox-08-id">React</Label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="checkbox-08-id" />
        <Label for="checkbox-08-id">Next.js</Label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="checkbox-08-id" />
        <Label for="checkbox-08-id">Astro</Label>
      </div>
    </div>
</template>
