<script setup lang="ts">
import { ClockIcon } from 'lucide-vue-next';
import { DateInput } from '@/components/ui/date-input';
import { TimeField } from '@/components/ui/time-field';



</script>

<template>
  <TimeField class="*:not-first:mt-2"><Label class="text-foreground text-sm font-medium">Time input with start icon</Label><div class="relative"><div class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3"><ClockIcon :size="16" aria-hidden="true" /></div><DateInput class="ps-9" /></div><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Built with{{ ' ' }}<a class="hover:text-foreground underline" href="https://react-spectrum.adobe.com/react-aria/DateField.html" target="_blank" rel="noopener nofollow">React Aria
        </a></p></TimeField>
</template>
