<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="flex items-center justify-between gap-2">
      <Checkbox id="checkbox-10-id" class="order-1" />
      <Label for="checkbox-10-id">Right aligned checkbox</Label>
    </div>
</template>
