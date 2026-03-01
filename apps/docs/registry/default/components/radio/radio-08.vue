<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<RadioGroup class="gap-2" defaultValue="1">
      
      <div class="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
        <RadioGroupItem
          value="1" id="radio-08-id" aria-describedby="radio-08-id-1-description"
          class="order-1 after:absolute after:inset-0"
        />
        <div class="grid grow gap-2">
          <Label for="radio-08-id">
            Label 
            <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
              (Sublabel)
            </span>
          </Label>
          <p id="radio-08-id" class="text-muted-foreground text-xs">
            You can use this card with a label and a description.
          </p>
        </div>
      </div>
      
      <div class="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
        <RadioGroupItem
          value="2" id="radio-08-id" aria-describedby="radio-08-id-2-description"
          class="order-1 after:absolute after:inset-0"
        />
        <div class="grid grow gap-2">
          <Label for="radio-08-id">
            Label 
            <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
              (Sublabel)
            </span>
          </Label>
          <p id="radio-08-id" class="text-muted-foreground text-xs">
            You can use this card with a label and a description.
          </p>
        </div>
      </div>
    </RadioGroup>
</template>
