<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { SelectNative } from '@/components/ui/select-native'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="select-02-id">Select with placeholder (native)</Label>
      <SelectNative id="select-02-id" defaultValue="">
        <option value="" disabled>
          Please select a value
        </option>
        <option value="1">1 to 5</option>
        <option value="2">5 to 10</option>
        <option value="3">More than 10</option>
      </SelectNative>
    </div>
</template>
