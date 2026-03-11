<script setup lang="ts">
import { computed, watch, useAttrs } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { connect as numberInputConnect, machine as numberInputMachine } from '@zag-js/number-input'
import type { Machine as NumberInputMachine } from '@zag-js/number-input'
import type { Machine as ZagMachine, MachineSchema as ZagMachineSchema } from '@zag-js/core'
import { cn } from '@timui/core'
import type { HTMLAttributes } from 'vue'
import { NumberFieldProvider } from './use-number-field-context'

defineOptions({
  inheritAttrs: false,
})

type NumberFieldProps = {
  id?: string
  modelValue?: number | string
  defaultValue?: number | string
  min?: number
  max?: number
  minValue?: number | string
  maxValue?: number | string
  step?: number
  formatOptions?: Intl.NumberFormatOptions
  inputMode?: 'text' | 'tel' | 'numeric' | 'decimal'
  allowMouseWheel?: boolean
  allowOverflow?: boolean
  clampValueOnBlur?: boolean
  focusInputOnChange?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<NumberFieldProps>(), {
  step: 1,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value?: number): void
  (e: 'change', value?: number): void
}>()

const attrs = useAttrs()

const toNumber = (value?: number | string) => {
  if (value === undefined || value === null || value === '') return undefined
  const num = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(num) ? num : undefined
}

const machineProps = computed(() => {
  const resolvedMin = props.min ?? toNumber(props.minValue)
  const resolvedMax = props.max ?? toNumber(props.maxValue)
  const controlledValue =
    props.modelValue !== undefined ? String(props.modelValue) : undefined
  const defaultValue =
    props.modelValue === undefined && props.defaultValue !== undefined
      ? String(props.defaultValue)
      : undefined

  return {
    id: props.id,
    value: controlledValue,
    defaultValue,
    min: resolvedMin,
    max: resolvedMax,
    step: props.step,
    formatOptions: props.formatOptions,
    inputMode: props.inputMode,
    allowMouseWheel: props.allowMouseWheel,
    allowOverflow: props.allowOverflow,
    clampValueOnBlur: props.clampValueOnBlur,
    focusInputOnChange: props.focusInputOnChange,
    disabled: props.disabled,
    readOnly: props.readOnly,
    required: props.required,
    invalid: props.invalid,
    onValueChange(details: { value: string; valueAsNumber: number }) {
      const next = Number.isFinite(details.valueAsNumber) ? details.valueAsNumber : undefined
      emit('update:modelValue', next)
      emit('change', next)
    },
  }
})

type InferMachineSchema<T> = T extends ZagMachine<infer S> ? S : ZagMachineSchema
type NumberInputSchema = InferMachineSchema<NumberInputMachine>

const service = useMachine<NumberInputSchema>(numberInputMachine, machineProps)
const api = computed(() => numberInputConnect(service, normalizeProps))

watch(
  () => props.modelValue,
  (next) => {
    const numeric = toNumber(next)
    if (numeric !== undefined && api.value?.valueAsNumber !== numeric) {
      api.value?.setValue(numeric)
    }
  }
)

NumberFieldProvider(api)

const rootProps = computed(() => {
  const baseProps = api.value?.getRootProps?.() ?? {}
  return {
    ...baseProps,
    ...attrs,
    class: cn(props.class, (attrs.class as string) || ''),
    'data-slot': 'number-field',
  }
})
</script>

<template>
  <div v-bind="rootProps">
    <slot />
  </div>
</template>
