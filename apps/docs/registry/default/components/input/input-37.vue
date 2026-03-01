<script setup lang="ts">
import { TimeField } from '@/components/ui/time-field'
import { Label } from '@/components/ui/label'
import { DateInput } from '@/components/ui/date-input'
</script>
<template>
<TimeField class="*:not-first:mt-2">
      <Label class="text-foreground text-sm font-medium">Time input</Label>
      <DateInput />
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
