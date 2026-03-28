<script setup lang="ts">
import { DatePicker } from '@timui/vue'
import { Label } from '@timui/vue'
</script>

<template>
  <div class="*:not-first:mt-2">
    <Label class="text-foreground text-sm font-medium">Date picker</Label>
    <DatePicker />

    <p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
      Built with
      <a
        class="hover:text-foreground underline"
        href="https://react-spectrum.adobe.com/react-aria/DatePicker.html"
        target="_blank"
        rel="noopener nofollow"
      >
        React Aria
      </a>
    </p>
  </div>
</template>
