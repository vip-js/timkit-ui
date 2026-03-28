<script setup lang="ts">
import { Shuffle } from 'lucide-vue-next';
import { Stepper } from '@timui/vue';
import { StepperIndicator } from '@timui/vue';
import { StepperItem } from '@timui/vue';
import { StepperSeparator } from '@timui/vue';
import { StepperTrigger } from '@timui/vue';




</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><Stepper :default-value="2"><StepperItem :step="1" class="not-last:flex-1"><StepperTrigger><StepperIndicator as-child><img class="rounded-full" src="/avatar-40-05.jpg" :width="32" :height="32" alt="Mike Palmer" /></StepperIndicator></StepperTrigger><StepperSeparator /></StepperItem><StepperItem :step="2" class="not-last:flex-1" loading><StepperTrigger><StepperIndicator /></StepperTrigger><StepperSeparator /></StepperItem><StepperItem :step="3" class="not-last:flex-1"><StepperTrigger><StepperIndicator as-child><Shuffle :size="14" aria-hidden="true" /><span class="sr-only">Shuffle</span></StepperIndicator></StepperTrigger></StepperItem></Stepper><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Stepper with mixed elements
      </p></div>
</template>
