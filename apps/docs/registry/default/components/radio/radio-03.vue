<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<RadioGroup defaultValue="2" disabled>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="1" id="radio-03-id" />
        <Label for="radio-03-id">Option 1</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="2" id="radio-03-id" />
        <Label for="radio-03-id">Option 2</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="3" id="radio-03-id" />
        <Label for="radio-03-id">Option 3</Label>
      </div>
    </RadioGroup>
</template>
