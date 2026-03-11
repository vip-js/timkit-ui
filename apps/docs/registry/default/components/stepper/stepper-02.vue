<script setup lang="ts">
import { Stepper } from '@/components/ui/stepper';
import { StepperIndicator } from '@/components/ui/stepper-indicator';
import { StepperItem } from '@/components/ui/stepper-item';
import { StepperSeparator } from '@/components/ui/stepper-separator';
import { StepperTrigger } from '@/components/ui/stepper-trigger';



</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><Stepper :default-value="2"><StepperItem v-for="(step, index) in steps" :key="index" :key="step" :step="step" class="not-last:flex-1"><StepperTrigger><StepperIndicator /></StepperTrigger><StepperSeparator v-if="step < steps.length" /></StepperItem></Stepper><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Stepper with numbers and checkmarks
      </p></div>
</template>
