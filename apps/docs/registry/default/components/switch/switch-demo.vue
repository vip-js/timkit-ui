<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <Switch id="docs-switch-demo" default-checked />
    <Label htmlFor="docs-switch-demo">Enable release preview</Label>
  </div>
</template>
