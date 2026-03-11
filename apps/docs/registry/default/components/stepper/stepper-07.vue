<script setup lang="ts">
import { Stepper } from '@/components/ui/stepper';
import { StepperIndicator } from '@/components/ui/stepper-indicator';
import { StepperItem } from '@/components/ui/stepper-item';
import { StepperTitle } from '@/components/ui/stepper-title';
import { StepperTrigger } from '@/components/ui/stepper-trigger';



</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><Stepper :default-value="2" class="items-start gap-4"><StepperItem v-for="({ step, title }, index) in steps" :key="index" :key="step" :step="step" class="flex-1"><StepperTrigger class="w-full flex-col items-start gap-2 rounded"><StepperIndicator as-child class="bg-border h-1 w-full"><span class="sr-only">{{ step }}</span></StepperIndicator><div class="space-y-0.5"><StepperTitle>{{ title }}</StepperTitle></div></StepperTrigger></StepperItem></Stepper><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Stepper with labels
      </p></div>
</template>
