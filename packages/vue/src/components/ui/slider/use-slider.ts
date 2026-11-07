import { sliderConnect, sliderMachine } from '@timui/core'
import type { SliderVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, ref, useId, watchEffect } from 'vue'

type SliderEmits = {
  (event: 'update:modelValue', value: number[]): void
  (event: 'change', value: number[]): void
  (event: 'commit', value: number[]): void
}

export function useSlider(props: SliderVueProps, emit: SliderEmits) {
  const generatedId = useId()

  const machineProps = computed(() => {
    const controlledValue = props.modelValue !== undefined ? props.modelValue : props.value
    const low = props.min ?? 0
    const high = props.max ?? 100
    const clamp = (list: number[]) => list.map((item) => Math.min(high, Math.max(low, item)))
    const raw = controlledValue === null ? [] : controlledValue
    const value = Array.isArray(raw) ? clamp(raw) : raw
    const thumbCount = Math.max(
      1,
      Array.isArray(value) ? value.length : Array.isArray(props.defaultValue) ? props.defaultValue.length : 1
    )
    const passedLabel = props['aria-label']
    const labels =
      passedLabel === undefined
        ? props['aria-labelledby'] === undefined
          ? Array.from({ length: thumbCount }, () => 'Value')
          : undefined
        : Array.isArray(passedLabel)
          ? passedLabel
          : Array.from({ length: thumbCount }, () => passedLabel)
    return {
      id: props.id ?? generatedId,
      ids: props.ids,
      dir: props.dir,
      'aria-label': labels,
      'aria-labelledby': props['aria-labelledby'],
      name: props.name,
      form: props.form,
      ...(value === undefined ? { defaultValue: props.defaultValue } : { value }),
      min: low,
      max: high,
      step: props.step ?? 1,
      onValueChange(details: { value: number[] }) {
        props.onValueChange?.(details.value)
        emit('update:modelValue', details.value)
        emit('change', details.value)
      },
      onValueChangeEnd(details: { value: number[] }) {
        props.onValueChangeEnd?.(details.value)
        emit('commit', details.value)
      },
      onFocusChange: props.onFocusChange,
      getAriaValueText: props.getAriaValueText,
      disabled: props.disabled,
      readOnly: props.readOnly,
      invalid: props.invalid,
      minStepsBetweenThumbs: props.minStepsBetweenThumbs,
      ...(props.orientation === 'horizontal' || props.orientation === 'vertical'
        ? { orientation: props.orientation }
        : {}),
      origin: props.origin,
      thumbAlignment: props.thumbAlignment,
      thumbSize: props.thumbSize,
      thumbCollisionBehavior: props.thumbCollisionBehavior,
    }
  })

  const service = useMachine(sliderMachine, machineProps)
  const phase = ref('')
  watchEffect(() => {
    const value = service.context.get('value')
    phase.value = Array.isArray(value) ? value.join(',') : ''
  })
  const api = computed(() => {
    phase.value
    return sliderConnect(service, normalizeProps)
  })
  const emitted = ref('')
  watchEffect(() => {
    const low = props.min ?? 0
    const high = props.max ?? 100
    const clamp = (list: number[]) => list.map((item) => Math.min(high, Math.max(low, item)))
    const controlledValue = props.modelValue !== undefined ? props.modelValue : props.value
    if (Array.isArray(controlledValue)) {
      const next = clamp(controlledValue)
      const signature = next.join(',')
      const outside = controlledValue.some((item, index) => item !== next[index])
      if (outside && emitted.value !== signature) {
        emitted.value = signature
        emit('update:modelValue', next)
        emit('change', next)
      }
      return
    }
    const current = api.value.value
    if (!Array.isArray(current) || !current.length) return
    const next = clamp(current)
    if (next.some((item, index) => item !== current[index])) api.value.setValue(next)
  })

  return api
}
