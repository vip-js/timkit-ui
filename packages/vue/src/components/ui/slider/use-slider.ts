import { sliderConnect, sliderMachine } from '@timui/core'
import type { SliderVueProps } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed, useId } from 'vue'

type SliderEmits = {
  (event: 'update:modelValue', value: number[]): void
  (event: 'change', value: number[]): void
  (event: 'commit', value: number[]): void
}

export function useSlider(props: SliderVueProps, emit: SliderEmits) {
  const generatedId = useId()

  const machineProps = computed(() => {
    const controlledValue = props.modelValue ?? props.value
    return {
      id: props.id ?? generatedId,
      ids: props.ids,
      dir: props.dir,
      'aria-label': props['aria-label'],
      'aria-labelledby': props['aria-labelledby'],
      name: props.name,
      form: props.form,
      value: controlledValue,
      defaultValue:
        props.modelValue === undefined && props.value === undefined ? props.defaultValue : undefined,
      min: props.min ?? 0,
      max: props.max ?? 100,
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
      orientation: props.orientation,
      origin: props.origin,
      thumbAlignment: props.thumbAlignment,
      thumbSize: props.thumbSize,
      thumbCollisionBehavior: props.thumbCollisionBehavior,
    }
  })

  const service = useMachine(sliderMachine, machineProps)
  const api = computed(() => sliderConnect(service, normalizeProps))

  return api
}
