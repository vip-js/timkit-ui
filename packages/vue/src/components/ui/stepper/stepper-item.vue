<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { cn, stepperItemVariants } from '@timui/core'
import { useStepper, StepItemContextKey } from './stepper.vue'
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    step: number
    completed?: boolean
    disabled?: boolean
    loading?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    completed: false,
    disabled: false,
    loading: false,
  }
)

const { activeStep, registerStep } = useStepper()
registerStep(props.step)

const state = computed(() => {
  const current = activeStep.value
  if (props.completed || (current != null && props.step < current)) return 'completed'
  if (current != null && current === props.step) return 'active'
  return 'inactive'
})

const isLoading = computed(() => props.loading && activeStep.value != null && props.step === activeStep.value)

provide(StepItemContextKey, {
  step: props.step,
  state: state,
  isDisabled: toRef(props, 'disabled'),
  isLoading: isLoading,
})
</script>

<template>
  <div
    data-slot="stepper-item"
    :class="cn(stepperItemVariants(), props.class)"
    :data-state="state"
    :data-loading="isLoading ? true : undefined"
  >
    <slot />
  </div>
</template>
