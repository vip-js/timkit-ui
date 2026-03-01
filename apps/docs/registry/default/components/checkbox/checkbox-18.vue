<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="space-y-3">
    <div class="flex items-center gap-2">
      <Checkbox id="checkbox-18-id-1" />
      <Label for="checkbox-18-id-1">Natural Wonders</Label>
    </div>
    <div class="ms-6 space-y-3">
      <div class="flex items-center gap-2">
        <Checkbox id="checkbox-18-id-2" checked />
        <Label for="checkbox-18-id-2">Mountains</Label>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <Checkbox id="checkbox-18-id-3" />
          <Label for="checkbox-18-id-3">Waterfalls</Label>
        </div>
        <div class="ms-6 space-y-3">
          <div class="flex items-center gap-2">
            <Checkbox id="checkbox-18-id-4" />
            <Label for="checkbox-18-id-4">Niagara Falls</Label>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="checkbox-18-id-5" checked />
            <Label for="checkbox-18-id-5">Angel Falls</Label>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Checkbox id="checkbox-18-id-6" />
        <Label for="checkbox-18-id-6">Grand Canyon</Label>
      </div>
    </div>
  </div>
</template>
