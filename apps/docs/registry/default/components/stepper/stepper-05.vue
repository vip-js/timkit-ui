<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { StepperIndicator } from '@/components/ui/stepper-indicator';
import { StepperItem } from '@/components/ui/stepper-item';
import { StepperSeparator } from '@/components/ui/stepper-separator';
import { StepperTrigger } from '@/components/ui/stepper-trigger';



</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><Stepper :value="currentStep" @update:modelValue="setCurrentStep"><StepperItem v-for="(step, index) in steps" :key="index" :key="step" :step="step" class="not-last:flex-1" :loading="isLoading"><StepperTrigger as-child><StepperIndicator /></StepperTrigger><StepperSeparator v-if="step < steps.length" /></StepperItem></Stepper><div class="flex justify-center space-x-4"><Button variant="outline" class="w-32" @click="setCurrentStep((prev) => prev - 1)" :disabled="currentStep === 1">Prev step
        </Button><Button variant="outline" class="w-32" @click="handleNextStep" :disabled="currentStep > steps.length">Next step
        </Button></div><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Controlled stepper with checkmarks and loading state
      </p></div>
</template>
