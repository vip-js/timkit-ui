<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
</script>
<template>
<div class="grid grid-cols-2 gap-3">
      
        <div
          class="border-input has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
        >
          <div class="flex justify-between gap-2">
            <Checkbox
              id="checkbox-17-id-1"
              value=1
              class="order-1 after:absolute after:inset-0" checked
            />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <Label for="checkbox-17-id-1">Palette</Label>
        </div>
      

        <div
          class="border-input has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
        >
          <div class="flex justify-between gap-2">
            <Checkbox
              id="checkbox-17-id-2"
              value=2
              class="order-1 after:absolute after:inset-0"
            />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <Label for="checkbox-17-id-2">Brush</Label>
        </div>
      

        <div
          class="border-input has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
        >
          <div class="flex justify-between gap-2">
            <Checkbox
              id="checkbox-17-id-3"
              value=3
              class="order-1 after:absolute after:inset-0"
            />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <Label for="checkbox-17-id-3">Eraser</Label>
        </div>
      

        <div
          class="border-input has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
        >
          <div class="flex justify-between gap-2">
            <Checkbox
              id="checkbox-17-id-4"
              value=4
              class="order-1 after:absolute after:inset-0"
            />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </div>
          <Label for="checkbox-17-id-4">Cut</Label>
        </div>
      
    </div>
</template>
