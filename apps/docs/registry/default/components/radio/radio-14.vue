<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<fieldset class="space-y-4">
      <legend class="text-foreground text-sm leading-none font-medium">Server location</legend>
      <RadioGroup class="flex flex-wrap gap-2" defaultValue="1">
        
          <div
            class="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
          >
            <div class="flex items-center gap-2">
              <RadioGroupItem id="radio-14-id"
                value="1"
                class="after:absolute after:inset-0"
              />
              <Label for="radio-14-id">USA</Label>
            </div>
          </div>
        

          <div
            class="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
          >
            <div class="flex items-center gap-2">
              <RadioGroupItem id="radio-14-id"
                value="2"
                class="after:absolute after:inset-0"
              />
              <Label for="radio-14-id">UK</Label>
            </div>
          </div>
        

          <div
            class="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
          >
            <div class="flex items-center gap-2">
              <RadioGroupItem id="radio-14-id"
                value="3"
                class="after:absolute after:inset-0"
              />
              <Label for="radio-14-id">France</Label>
            </div>
          </div>
        
      </RadioGroup>
    </fieldset>
</template>
