<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
</script>
<template>
<RadioGroup defaultValue="all">
      <div class="flex items-center gap-2">
        <RadioGroupItem value="all" id="radio-06-id" />
        <Label for="radio-06-id">
          All reviews 
          <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
            (12,921)
          </span>
        </Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="5-stars" id="radio-06-id" />
        <Label for="radio-06-id" class="inline-flex items-center gap-1">
          <span class="inline-flex items-center text-amber-500" aria-hidden="true">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
          </span>
          <span class="sr-only">5 stars</span> 
          <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
            (5,168)
          </span>
        </Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="4-stars" id="radio-06-id" />
        <Label for="radio-06-id" class="inline-flex items-center gap-1">
          <span class="inline-flex items-center text-amber-500" aria-hidden="true">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
          </span>
          <span class="sr-only">4 stars</span> 
          <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
            (4,726)
          </span>
        </Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="3-stars" id="radio-06-id" />
        <Label for="radio-06-id" class="inline-flex items-center gap-1">
          <span class="inline-flex items-center text-amber-500" aria-hidden="true">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
          </span>
          <span class="sr-only">3 stars</span> 
          <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
            (3,234)
          </span>
        </Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="2-stars" id="radio-06-id" />
        <Label for="radio-06-id" class="inline-flex items-center gap-1">
          <span class="inline-flex items-center text-amber-500" aria-hidden="true">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
          </span>
          <span class="sr-only">2 stars</span> 
          <span class="text-muted-foreground text-xs leading-[inherit] font-normal">
            (1,842)
          </span>
        </Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem value="1-star" id="radio-06-id" />
        <Label for="radio-06-id" class="inline-flex items-center gap-1">
          <span class="inline-flex items-center text-amber-500" aria-hidden="true">
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
             <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-30"><circle cx="12" cy="12" r="9" /></svg>
          </span>
          <span class="sr-only">1 star</span> 
          <span class="text-muted-foreground text-xs leading-[inherit] font-normal">(452)</span>
        </Label>
      </div>
    </RadioGroup>
</template>
