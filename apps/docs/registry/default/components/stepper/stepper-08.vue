<script setup lang="ts">
import { ref } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { Button } from '@timui/vue';
import { Stepper } from '@timui/vue';
import { StepperIndicator } from '@timui/vue';
import { StepperItem } from '@timui/vue';
import { StepperTrigger } from '@timui/vue';



const currentStep = ref(2);


function setCurrentStep(next: typeof currentStep.value | ((prev: typeof currentStep.value) => typeof currentStep.value)) {
  currentStep.value = typeof next === 'function'
    ? (next as (prev: typeof currentStep.value) => typeof currentStep.value)(currentStep.value)
    : next;
}


const steps = [1, 2, 3, 4]

</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><div class="flex items-center gap-2"><Button class="shrink-0" variant="ghost" size="icon" @click="setCurrentStep((prev) => prev - 1)" :disabled="currentStep === 1" aria-label="Prev step"><ChevronLeftIcon :size="16" aria-hidden="true" /></Button><Stepper :value="currentStep" @update:modelValue="setCurrentStep" class="gap-1"><StepperItem v-for="(step, index) in steps" :key="step" :step="step" class="flex-1"><StepperTrigger class="w-full flex-col items-start gap-2" as-child><StepperIndicator as-child class="bg-border h-1 w-full"><span class="sr-only">{{ step }}</span></StepperIndicator></StepperTrigger></StepperItem></Stepper><Button class="shrink-0" variant="ghost" size="icon" @click="setCurrentStep((prev) => prev + 1)" :disabled="currentStep === steps.length" aria-label="Next step"><ChevronRightIcon :size="16" aria-hidden="true" /></Button></div><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Paginated stepper
      </p></div>
</template>
