<script setup lang="ts">
import { Label } from '@timui/vue'
import { Switch } from '@timui/vue'
</script>

<template>
  <div class="inline-flex items-center gap-2">
    <Switch id="docs-switch-demo" default-checked />
    <Label htmlFor="docs-switch-demo">Enable release preview</Label>
  </div>
</template>
