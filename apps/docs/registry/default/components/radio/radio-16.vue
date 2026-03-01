<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
</script>
<template>
<fieldset class="space-y-4">
      <legend class="text-foreground text-sm leading-none font-medium">
        Rate your experience
      </legend>
      <RadioGroup class="inline-flex gap-0" >
        
          <label
            class="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]"
          >
            <RadioGroupItem id="radio-16-id" value=1 class="sr-only" />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            <span class="sr-only">
              1 star
            </span>
          </label>
        

          <label
            class="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]"
          >
            <RadioGroupItem id="radio-16-id" value=2 class="sr-only" />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            <span class="sr-only">
              2 stars
            </span>
          </label>
        

          <label
            class="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]"
          >
            <RadioGroupItem id="radio-16-id" value=3 class="sr-only" />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            <span class="sr-only">
              3 stars
            </span>
          </label>
        

          <label
            class="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]"
          >
            <RadioGroupItem id="radio-16-id" value=4 class="sr-only" />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            <span class="sr-only">
              4 stars
            </span>
          </label>
        

          <label
            class="group has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative cursor-pointer rounded p-0.5 outline-none has-focus-visible:ring-[3px]"
          >
            <RadioGroupItem id="radio-16-id" value=5 class="sr-only" />
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
            <span class="sr-only">
              5 stars
            </span>
          </label>
        
      </RadioGroup>
    </fieldset>
</template>
