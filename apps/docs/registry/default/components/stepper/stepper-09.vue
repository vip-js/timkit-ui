<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { StepperIndicator } from '@/components/ui/stepper-indicator';
import { StepperItem } from '@/components/ui/stepper-item';
import { StepperTrigger } from '@/components/ui/stepper-trigger';



</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><div class="space-y-3"><Stepper :value="currentStep" @update:modelValue="setCurrentStep"><StepperItem v-for="(step, index) in steps" :key="index" :key="step" :step="step" class="flex-1"><StepperTrigger class="w-full flex-col items-start gap-2" as-child><StepperIndicator as-child class="bg-border h-2 w-full rounded-none"><span class="sr-only">{{ step }}</span></StepperIndicator></StepperTrigger></StepperItem></Stepper><div class="text-muted-foreground text-sm font-medium tabular-nums">Step {{ currentStep }}of {{ steps.length }}</div></div><div class="flex justify-center space-x-4"><Button variant="outline" class="w-32" @click="setCurrentStep((prev) => prev - 1)" :disabled="currentStep === 1">Prev step
        </Button><Button variant="outline" class="w-32" @click="setCurrentStep((prev) => prev + 1)" :disabled="currentStep >= steps.length">Next step
        </Button></div><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Progress stepper
      </p></div>
</template>
