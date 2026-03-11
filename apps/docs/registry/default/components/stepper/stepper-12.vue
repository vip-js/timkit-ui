<script setup lang="ts">
import { Stepper } from '@/components/ui/stepper';
import { StepperDescription } from '@/components/ui/stepper-description';
import { StepperIndicator } from '@/components/ui/stepper-indicator';
import { StepperItem } from '@/components/ui/stepper-item';
import { StepperSeparator } from '@/components/ui/stepper-separator';
import { StepperTitle } from '@/components/ui/stepper-title';
import { StepperTrigger } from '@/components/ui/stepper-trigger';



</script>

<template>
  <div class="space-y-8 text-center"><Stepper :default-value="2"><StepperItem v-for="({ step, title, description }, index) in steps" :key="index" :key="step" :step="step" class="not-last:flex-1 max-md:items-start"><StepperTrigger class="rounded max-md:flex-col"><StepperIndicator /><div class="text-center md:text-left"><StepperTitle>{{ title }}</StepperTitle><StepperDescription class="max-sm:hidden">{{ description }}</StepperDescription></div></StepperTrigger><StepperSeparator v-if="step < steps.length" class="max-md:mt-3.5 md:mx-4" /></StepperItem></Stepper><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Stepper with inline titles and descriptions
      </p></div>
</template>
