<script setup lang="ts">
import { TimeField } from '@/components/ui/time-field'
import { Label } from '@/components/ui/label'
import { DateInput } from '@/components/ui/date-input'
</script>
<template>
<TimeField class="*:not-first:mt-2">
      <Label class="text-foreground text-sm font-medium">Time input with end icon</Label>
      <div class="relative">
        <DateInput />
        <div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3">
           <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-60"><circle cx="12" cy="12" r="9" /></svg>
        </div>
      </div>
      <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Built with 
        <a
          class="hover:text-foreground underline"
          href="https://react-spectrum.adobe.com/react-aria/DateField.html"
          target="_blank"
          rel="noopener nofollow"
        >
          React Aria
        </a>
      </p>
    </TimeField>
</template>
