<script lang="ts">
import { type InjectionKey, type Ref, type ComputedRef, inject } from 'vue'
import type { StepperApi } from '@timui/core'

export type StepperContextValue = {
  api: ComputedRef<StepperApi | null>
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
import { computed, provide, toRef, watch, useId } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import type { Machine as NumberInputMachine } from '@zag-js/number-input'
import type { Machine as ZagMachine, MachineSchema as ZagMachineSchema } from '@zag-js/core'
import { cn, stepperVariants, stepperConnect, stepperMachine } from '@timui/core'
import type { HTMLAttributes } from 'vue'

type InferMachineSchema<T> = T extends ZagMachine<infer S> ? S : ZagMachineSchema
type NumberInputSchema = InferMachineSchema<NumberInputMachine>

const props = withDefaults(
  defineProps<{
    id?: string
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
  (e: 'change', value: number): void
}>()
const generatedId = useId()

const service = useMachine<NumberInputSchema>(stepperMachine, {
  id: props.id ?? generatedId,
  value: props.modelValue !== undefined ? String(props.modelValue) : undefined,
  defaultValue: props.modelValue === undefined ? String(props.defaultValue) : undefined,
  onValueChange(details: { value: string; valueAsNumber: number }) {
    emits('update:modelValue', details.valueAsNumber)
    emits('change', details.valueAsNumber)
  },
})

const api = computed(() => stepperConnect(service, normalizeProps))
const activeStep = computed(() => api.value?.valueAsNumber ?? 0)

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== undefined && api.value?.valueAsNumber !== newVal) {
      api.value?.setValue(newVal)
    }
  }
)

const setActiveStep = (step: number) => {
  api.value?.setValue(step)
}

provide(StepperContextKey, {
  api,
  activeStep,
  setActiveStep,
  orientation: toRef(props, 'orientation'),
})
</script>

<template>
  <div
    data-slot="stepper"
    :class="cn(stepperVariants(), props.class)"
    :data-orientation="orientation"
    v-bind="api?.getRootProps?.()"
  >
    <slot />
  </div>
</template>
