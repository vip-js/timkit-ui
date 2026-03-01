<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SelectNative } from '@/components/ui/select-native'
</script>
<template>
<div class="*:not-first:mt-2">
      <Label for="input-18-id">Input with end select</Label>
      <div class="flex rounded-md shadow-xs">
        <Input id="input-18-id"
          class="-me-px rounded-e-none shadow-none focus-visible:z-10"
          placeholder="google"
          type="text"
        />
        <SelectNative class="text-muted-foreground hover:text-foreground w-fit rounded-s-none shadow-none">
          <option>.com</option>
          <option>.org</option>
          <option>.net</option>
        </SelectNative>
      </div>
    </div>
</template>
