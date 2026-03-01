<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
</script>
<template>
<fieldset class="space-y-4">
        <legend class="text-foreground text-sm leading-none font-medium">
          How likely are you to recommend us?
        </legend>
        <RadioGroup class="flex gap-0 -space-x-px rounded-md shadow-xs">
          
            <label
              class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm font-medium transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
            >
              <RadioGroupItem id="radio-18-id"
                value=0
                class="sr-only after:absolute after:inset-0"
              />
              0
            </label>
          

            <label
              class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm font-medium transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
            >
              <RadioGroupItem id="radio-18-id"
                value=1
                class="sr-only after:absolute after:inset-0"
              />
              1
            </label>
          

            <label
              class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm font-medium transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
            >
              <RadioGroupItem id="radio-18-id"
                value=2
                class="sr-only after:absolute after:inset-0"
              />
              2
            </label>
          

            <label
              class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm font-medium transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
            >
              <RadioGroupItem id="radio-18-id"
                value=3
                class="sr-only after:absolute after:inset-0"
              />
              3
            </label>
          

            <label
              class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm font-medium transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
            >
              <RadioGroupItem id="radio-18-id"
                value=4
                class="sr-only after:absolute after:inset-0"
              />
              4
            </label>
          

            <label
              class="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm font-medium transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
            >
              <RadioGroupItem id="radio-18-id"
                value=5
                class="sr-only after:absolute after:inset-0"
              />
              5
            </label>
          
        </RadioGroup>
      </fieldset>
      <div class="mt-1 flex justify-between text-xs font-medium">
        <p>
          <span class="text-base">😡</span> Not likely
        </p>
        <p>
          Very Likely <span class="text-base">😍</span>
        </p>
      </div>
</template>
