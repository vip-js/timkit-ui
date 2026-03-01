<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { cn } from "@/lib/utils"
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

const { activeStep } = useStepper()

const state = computed(() => {
  if (props.completed || props.step < activeStep.value) return 'completed'
  if (activeStep.value === props.step) return 'active'
  return 'inactive'
})

const isLoading = computed(() => props.loading && props.step === activeStep.value)

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
    :class="
      cn(
        'group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col',
        props.class
      )
    "
    :data-state="state"
    :data-loading="isLoading ? true : undefined"
  >
    <slot />
  </div>
</template>
