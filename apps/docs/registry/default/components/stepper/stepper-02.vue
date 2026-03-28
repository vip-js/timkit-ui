<script setup lang="ts">
import { Stepper } from '@timui/vue';
import { StepperIndicator } from '@timui/vue';
import { StepperItem } from '@timui/vue';
import { StepperSeparator } from '@timui/vue';
import { StepperTrigger } from '@timui/vue';





const steps = [1, 2, 3, 4]

</script>

<template>
  <div class="mx-auto max-w-xl space-y-8 text-center"><Stepper :default-value="2"><StepperItem v-for="(step, index) in steps" :key="step" :step="step" class="not-last:flex-1"><StepperTrigger><StepperIndicator /></StepperTrigger><StepperSeparator v-if="step < steps.length" /></StepperItem></Stepper><p class="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">Stepper with numbers and checkmarks
      </p></div>
</template>
