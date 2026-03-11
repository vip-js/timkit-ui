<script setup lang="ts">
import { Stepper } from '@/components/ui/stepper';
import { StepperIndicator } from '@/components/ui/stepper-indicator';
import { StepperItem } from '@/components/ui/stepper-item';
import { StepperSeparator } from '@/components/ui/stepper-separator';
import { StepperTrigger } from '@/components/ui/stepper-trigger';



</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><Stepper :default-value="2"><StepperItem v-for="(step, index) in steps" :key="index" :key="step" :step="step" class="not-last:flex-1"><StepperTrigger><StepperIndicator class="data-[state=active]:border-primary size-4 data-[state=active]:border-2 data-[state=active]:bg-transparent [&_span]:sr-only [&_svg]:size-3" /></StepperTrigger><StepperSeparator v-if="step < steps.length" /></StepperItem></Stepper><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Stepper with tiny buttons and checkmarks
      </p></div>
</template>
