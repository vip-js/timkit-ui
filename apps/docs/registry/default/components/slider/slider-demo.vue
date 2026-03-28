<script setup lang="ts">
import { Label } from '@timui/vue'
import { Slider } from '@timui/vue'
</script>

<template>
  <div class="space-y-4">
    <Label>Progress threshold</Label>
    <Slider :default-value="[40]" aria-label="Progress threshold" />
  </div>
</template>
