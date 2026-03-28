<script setup lang="ts">
import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTrigger } from '@timui/vue'

const steps = [1, 2, 3]
</script>

<template>
  <Stepper :default-value="2" class="mx-auto max-w-xl">
    <StepperItem
      v-for="step in steps"
      :key="step"
      :step="step"
      class="not-last:flex-1"
    >
      <StepperTrigger>
        <StepperIndicator asChild>{{ step }}</StepperIndicator>
      </StepperTrigger>
      <StepperSeparator v-if="step < steps.length" />
    </StepperItem>
  </Stepper>
</template>
