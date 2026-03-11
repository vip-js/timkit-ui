<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { StepperIndicator } from '@/components/ui/stepper-indicator';
import { StepperItem } from '@/components/ui/stepper-item';
import { StepperTrigger } from '@/components/ui/stepper-trigger';



</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><div class="flex items-center gap-2"><Button class="shrink-0" variant="ghost" size="icon" @click="setCurrentStep((prev) => prev - 1)" :disabled="currentStep === 1" aria-label="Prev step"><ChevronLeftIcon :size="16" aria-hidden="true" /></Button><Stepper :value="currentStep" @update:modelValue="setCurrentStep" class="gap-1"><StepperItem v-for="(step, index) in steps" :key="index" :key="step" :step="step" class="flex-1"><StepperTrigger class="w-full flex-col items-start gap-2" as-child><StepperIndicator as-child class="bg-border h-1 w-full"><span class="sr-only">{{ step }}</span></StepperIndicator></StepperTrigger></StepperItem></Stepper><Button class="shrink-0" variant="ghost" size="icon" @click="setCurrentStep((prev) => prev + 1)" :disabled="currentStep === steps.length" aria-label="Next step"><ChevronRightIcon :size="16" aria-hidden="true" /></Button></div><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Paginated stepper
      </p></div>
</template>
