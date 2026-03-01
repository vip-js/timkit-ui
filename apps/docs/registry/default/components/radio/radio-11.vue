<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<RadioGroup class="grid-cols-2" defaultValue="1">
      
        <div
          class="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
        >
          <div class="flex justify-between gap-2">
            <RadioGroupItem id="radio-11-id"
              value="1"
              class="order-1 after:absolute after:inset-0"
            />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <Label for="radio-11-id">Palette</Label>
        </div>
      

        <div
          class="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
        >
          <div class="flex justify-between gap-2">
            <RadioGroupItem id="radio-11-id"
              value="2"
              class="order-1 after:absolute after:inset-0"
            />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <Label for="radio-11-id">Brush</Label>
        </div>
      

        <div
          class="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
        >
          <div class="flex justify-between gap-2">
            <RadioGroupItem id="radio-11-id"
              value="3"
              class="order-1 after:absolute after:inset-0"
            />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <Label for="radio-11-id">Eraser</Label>
        </div>
      

        <div
          class="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
        >
          <div class="flex justify-between gap-2">
            <RadioGroupItem id="radio-11-id"
              value="4"
              class="order-1 after:absolute after:inset-0"
            />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <Label for="radio-11-id">Cut</Label>
        </div>
      
    </RadioGroup>
</template>
