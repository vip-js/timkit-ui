<script setup lang="ts">
import { computed, ref, watch, watchEffect, useAttrs, useId } from 'vue'
import { normalizeProps, useMachine } from '@zag-js/vue'
import {
  cn,
  numberFieldConnect,
  numberFieldMachine,
  type NumberFieldMachine,
} from '@timui/core'
import type { Machine as ZagMachine, MachineSchema as ZagMachineSchema } from '@zag-js/core'
import type { HTMLAttributes } from 'vue'
import { NumberFieldProvider } from './use-number-field-context'

defineOptions({
  inheritAttrs: false,
})

type NumberFieldProps = {
  id?: string
  modelValue?: number | string | null
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
const generatedId = useId()

const toNumber = (value?: number | string) => {
  if (value === undefined || value === null || value === '') return undefined
  const num = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(num) ? num : undefined
}

const machineProps = computed(() => {
  const resolvedMin = props.min ?? toNumber(props.minValue)
  const resolvedMax = props.max ?? toNumber(props.maxValue)
  const controlledValue =
    props.modelValue === undefined
      ? undefined
      : props.modelValue == null || props.modelValue === ''
        ? ''
        : String(props.modelValue)
  const defaultValue =
    props.modelValue === undefined && props.defaultValue !== undefined
      ? String(props.defaultValue)
      : undefined

  return {
    id: props.id ?? generatedId,
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
type NumberFieldSchema = InferMachineSchema<NumberFieldMachine>

const service = useMachine<NumberFieldSchema>(numberFieldMachine, machineProps)
const phase = ref('')
watchEffect(() => {
  phase.value = String(service.context.get('value') ?? '')
})
const api = computed(() => {
  phase.value
  return numberFieldConnect(service, normalizeProps)
})
const emitted = ref('')
watchEffect(() => {
  const raw = api.value?.value
  const current = Number(raw)
  if (raw === '' || raw == null || !Number.isFinite(current)) return
  const low = props.min ?? toNumber(props.minValue)
  const high = props.max ?? toNumber(props.maxValue)
  let next = current
  if (low != null) next = Math.max(low, next)
  if (high != null) next = Math.min(high, next)
  if (next === current) return
  if (props.modelValue !== undefined) {
    const signature = String(next)
    if (emitted.value === signature) return
    emitted.value = signature
    emit('update:modelValue', next)
    emit('change', next)
    return
  }
  api.value?.setValue(next)
})

watch(
  () => props.modelValue,
  (next) => {
    if (next === undefined) return
    if (next == null || next === '') {
      const clear = api.value?.setValue as ((value: number | '') => void) | undefined
      if (api.value?.value !== '') clear?.('')
      return
    }
    const numeric = toNumber(next)
    if (numeric !== undefined && api.value?.valueAsNumber !== numeric) {
      api.value?.setValue(numeric)
    }
  }
)

NumberFieldProvider(api)

const valueStatus = computed(() => {
  const raw = phase.value
  if (raw === '') return ''
  const numeric = Number(raw)
  return Number.isFinite(numeric) ? String(numeric) : ''
})

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
    <p v-if="valueStatus" role="status">{{ valueStatus }}</p>
    <slot />
  </div>
</template>
