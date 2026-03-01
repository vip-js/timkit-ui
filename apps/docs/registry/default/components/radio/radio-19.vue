<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
</script>
<template>
<fieldset class="space-y-4">
      <legend class="text-foreground text-sm leading-none font-medium">Choose a theme</legend>
      <RadioGroup class="flex gap-3" defaultValue="1">
        
          <label>
            <RadioGroupItem id="radio-19-id"
              value="1"
              class="peer sr-only after:absolute after:inset-0"
            />
            <img
              src=/ui-light.png
              alt=Light width="88" height="70"
              class="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
            />
            <span class="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-peer-data-[state=unchecked]:hidden"><circle cx="12" cy="12" r="9" /></svg>
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-peer-data-[state=checked]:hidden"><circle cx="12" cy="12" r="9" /></svg>
              <span class="text-xs font-medium">Light</span>
            </span>
          </label>
        

          <label>
            <RadioGroupItem id="radio-19-id"
              value="2"
              class="peer sr-only after:absolute after:inset-0"
            />
            <img
              src=/ui-dark.png
              alt=Dark width="88" height="70"
              class="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
            />
            <span class="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-peer-data-[state=unchecked]:hidden"><circle cx="12" cy="12" r="9" /></svg>
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-peer-data-[state=checked]:hidden"><circle cx="12" cy="12" r="9" /></svg>
              <span class="text-xs font-medium">Dark</span>
            </span>
          </label>
        

          <label>
            <RadioGroupItem id="radio-19-id"
              value="3"
              class="peer sr-only after:absolute after:inset-0"
            />
            <img
              src=/ui-system.png
              alt=System width="88" height="70"
              class="border-input peer-focus-visible:ring-ring/50 peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent relative cursor-pointer overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] outline-none peer-focus-visible:ring-[3px] peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
            />
            <span class="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-peer-data-[state=unchecked]:hidden"><circle cx="12" cy="12" r="9" /></svg>
               <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-peer-data-[state=checked]:hidden"><circle cx="12" cy="12" r="9" /></svg>
              <span class="text-xs font-medium">System</span>
            </span>
          </label>
        
      </RadioGroup>
    </fieldset>
</template>
