<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<RadioGroup class="gap-6" defaultValue="1">
      <div class="flex items-start gap-2">
        <RadioGroupItem value="1" id="radio-04-id" aria-describedby="radio-04-id-1-description" />
        <div class="grid grow gap-2">
          <Label for="radio-04-id">
            Small 
            <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
              (Sublabel)
            </span>
          </Label>
          <p id="radio-04-id" class="text-muted-foreground text-xs">
            You can use this card with a label and a description.
          </p>
        </div>
      </div>
      <div class="flex items-start gap-2">
        <RadioGroupItem value="2" id="radio-04-id" aria-describedby="radio-04-id-2-description" />
        <div class="grid grow gap-2">
          <Label for="radio-04-id">
            Large 
            <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
              (Sublabel)
            </span>
          </Label>
          <p id="radio-04-id" class="text-muted-foreground text-xs">
            You can use this card with a label and a description.
          </p>
        </div>
      </div>
    </RadioGroup>
</template>
