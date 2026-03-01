<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="grid gap-3">
      <div class="flex items-center gap-2">
        <Checkbox id="checkbox-09-id" />
        <Label for="checkbox-09-id">React</Label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="checkbox-09-id" />
        <Label for="checkbox-09-id">Next.js</Label>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="checkbox-09-id" />
        <Label for="checkbox-09-id">Astro</Label>
      </div>
    </div>
</template>
