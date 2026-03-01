<script lang="ts">
import { type InjectionKey, type Ref, inject } from 'vue'

export type StepperContextValue = {
  activeStep: Ref<number>
  setActiveStep: (step: number) => void
  orientation: Ref<'horizontal' | 'vertical'>
}

export type StepItemContextValue = {
  step: number
  state: Ref<'active' | 'completed' | 'inactive' | 'loading'>
  isDisabled: Ref<boolean>
  isLoading: Ref<boolean>
}

export const StepperContextKey = Symbol('StepperContext') as InjectionKey<StepperContextValue>
export const StepItemContextKey = Symbol('StepItemContext') as InjectionKey<StepItemContextValue>

export const useStepper = () => {
  const context = inject(StepperContextKey)
  if (!context) {
    throw new Error('useStepper must be used within a Stepper')
  }
  return context
}

export const useStepItem = () => {
  const context = inject(StepItemContextKey)
  if (!context) {
    throw new Error('useStepItem must be used within a StepperItem')
  }
  return context
}
</script>

<script setup lang="ts">
import { computed, provide, toRef, ref, watch } from 'vue'
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    defaultValue?: number
    modelValue?: number
    orientation?: 'horizontal' | 'vertical'
    class?: HTMLAttributes['class']
  }>(),
  {
    defaultValue: 0,
    orientation: 'horizontal',
  }
)

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const activeStep = ref(props.defaultValue)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined) {
      activeStep.value = newVal
    }
  },
  { immediate: true }
)

const setActiveStep = (step: number) => {
  if (props.modelValue === undefined) {
    activeStep.value = step
  }
  emits('update:modelValue', step)
}

provide(StepperContextKey, {
  activeStep,
  setActiveStep,
  orientation: toRef(props, 'orientation'),
})
</script>

<template>
  <div
    data-slot="stepper"
    :class="
      cn(
        'group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
        props.class
      )
    "
    :data-orientation="orientation"
  >
    <slot />
  </div>
</template>
