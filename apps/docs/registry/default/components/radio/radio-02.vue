<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<RadioGroup
      defaultValue="1"
      class="[--primary:var(--color-indigo-500)] [--ring:var(--color-indigo-300)] in-[.dark]:[--primary:var(--color-indigo-500)] in-[.dark]:[--ring:var(--color-indigo-900)]"
    >
      <div class="flex items-center gap-2">
        <RadioGroupItem value="1" id="radio-02-id" />
        <Label for="radio-02-id">Option 1</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="2" id="radio-02-id" />
        <Label for="radio-02-id">Option 2</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="3" id="radio-02-id" />
        <Label for="radio-02-id">Option 3</Label>
      </div>
    </RadioGroup>
</template>
