<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@timui/vue';
import { Stepper } from '@timui/vue';
import { StepperIndicator } from '@timui/vue';
import { StepperItem } from '@timui/vue';
import { StepperSeparator } from '@timui/vue';
import { StepperTrigger } from '@timui/vue';



const currentStep = ref(1);


function setCurrentStep(next: typeof currentStep.value | ((prev: typeof currentStep.value) => typeof currentStep.value)) {
  currentStep.value = typeof next === 'function'
    ? (next as (prev: typeof currentStep.value) => typeof currentStep.value)(currentStep.value)
    : next;
}


const steps = [1, 2, 3, 4]

</script>

<template>
  <div class="space-y-8 text-center"><Stepper :value="currentStep" @update:modelValue="setCurrentStep" orientation="vertical"><StepperItem v-for="(step, index) in steps" :key="step" :step="step" class="not-last:flex-1"><StepperTrigger as-child><StepperIndicator /></StepperTrigger><StepperSeparator v-if="step < steps.length" /></StepperItem></Stepper><div class="flex justify-center space-x-4"><Button variant="outline" class="w-32" @click="setCurrentStep((prev) => prev - 1)" :disabled="currentStep === 1">Prev step
        </Button><Button variant="outline" class="w-32" @click="setCurrentStep((prev) => prev + 1)" :disabled="currentStep > steps.length">Next step
        </Button></div><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Controlled vertical stepper with checkmarks
      </p></div>
</template>
