<script lang="ts">
import { type InjectionKey, type Ref, type ComputedRef, inject } from 'vue'
import type { StepperApi } from '@timui/core'

export type StepperContextValue = {
  api: ComputedRef<StepperApi | null>
  activeStep: Ref<number | null>
  setActiveStep: (step: number) => void
  orientation: Ref<'horizontal' | 'vertical'>
  readOnly: Ref<boolean>
  registerStep: (step: number) => void
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
import { computed, provide, ref, toRef, useAttrs, watch, watchEffect, useId } from 'vue'
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
    modelValue?: number | null
    orientation?: 'horizontal' | 'vertical'
    readOnly?: boolean
    min?: number
    max?: number
    step?: number
    class?: HTMLAttributes['class']
  }>(),
  {
    defaultValue: 0,
    orientation: 'horizontal',
  }
)

const attrs = useAttrs()

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()
const generatedId = useId()

const machineProps = computed(() => ({
  id: props.id ?? generatedId,
  value:
    props.modelValue === undefined
      ? undefined
      : props.modelValue == null
        ? ''
        : String(props.modelValue),
  defaultValue: props.modelValue === undefined ? String(props.defaultValue) : undefined,
  ...(typeof props.min === 'number' ? { min: props.min } : {}),
  ...(typeof props.max === 'number' ? { max: props.max } : {}),
  ...(typeof props.step === 'number' ? { step: props.step } : {}),
  readOnly: props.readOnly === true,
  onValueChange(details: { value: string; valueAsNumber: number }) {
    emits('update:modelValue', details.valueAsNumber)
    emits('change', details.valueAsNumber)
  },
}))

const service = useMachine<NumberInputSchema>(stepperMachine, machineProps)
const phase = ref(
  props.modelValue === undefined
    ? String(props.defaultValue ?? 0)
    : props.modelValue == null
      ? ''
      : String(props.modelValue)
)
watchEffect(() => {
  const next = service.context.get('value')
  if (next != null && next !== '') phase.value = String(next)
})

const api = computed(() => {
  phase.value
  return stepperConnect(service, normalizeProps)
})
const activeStep = computed(() => {
  if (props.modelValue !== undefined) {
    return props.modelValue == null || !Number.isFinite(props.modelValue) ? null : props.modelValue
  }
  const current = api.value?.valueAsNumber
  return Number.isFinite(current) ? current : 0
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal === undefined) return
    if (newVal == null) {
      const clear = api.value?.setValue as ((value: number | '') => void) | undefined
      clear?.('')
      return
    }
    if (api.value?.valueAsNumber !== newVal) api.value?.setValue(newVal)
  }
)

const registered = ref<number[]>([])
const registerStep = (step: number) => {
  if (registered.value.includes(step)) return
  registered.value = [...registered.value, step]
}
const stepStatus = computed(() => {
  const index = activeStep.value == null ? -1 : registered.value.indexOf(activeStep.value)
  return index < 0 ? '' : `Step ${index + 1} of ${registered.value.length}`
})

const setActiveStep = (step: number) => {
  if (props.readOnly) return
  if (typeof props.min === 'number' && step < props.min) return
  if (typeof props.max === 'number' && step > props.max) return
  if (props.modelValue !== undefined) {
    emits('update:modelValue', step)
    emits('change', step)
    return
  }
  api.value?.setValue(step)
}

provide(StepperContextKey, {
  api,
  activeStep,
  setActiveStep,
  orientation: toRef(props, 'orientation'),
  readOnly: computed(() => props.readOnly === true),
  registerStep,
})
</script>

<template>
  <div
    data-slot="stepper"
    :class="cn(stepperVariants(), props.class)"
    :data-orientation="orientation"
    :aria-readonly="props.readOnly || undefined"
    v-bind="api?.getRootProps?.()"
    role="group"
    :aria-label="attrs['aria-labelledby'] ? undefined : attrs['aria-label'] || 'Stepper'"
  >
    <p v-if="stepStatus" role="status">{{ stepStatus }}</p>
    <slot />
  </div>
</template>
