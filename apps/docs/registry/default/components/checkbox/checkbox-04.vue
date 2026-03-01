<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="flex items-center gap-2">
      <Checkbox id="checkbox-04-id" disabled />
      <Label for="checkbox-04-id">Disabled checkbox</Label>
    </div>
</template>
