<script setup lang="ts">
import { ref } from 'vue'
import { DateField } from '@timui/vue'
import { DateInput } from '@timui/vue'
import { Label } from '@timui/vue'



const demoClicks = ref(0)
function onDemoClick() {
  demoClicks.value += 1
}
</script>

<template>
  <DateField @click="onDemoClick" class="*:not-first:mt-2" granularity="minute" :hourCycle="24">
    <Label class="text-foreground text-sm font-medium">Date and time input</Label>
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
  </DateField>
</template>
