<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
</script>

<template>
  <div class="space-y-4">
    <Label>Progress threshold</Label>
    <Slider :default-value="[40]" aria-label="Progress threshold" />
  </div>
</template>
