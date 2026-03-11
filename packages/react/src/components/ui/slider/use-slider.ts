import * as React from 'react'
import type { SliderProps as CoreSliderProps } from '@timui/core'
import { createTimEvent, sliderConnect, sliderMachine } from '@timui/core'
import { normalizeProps, useMachine } from '@zag-js/react'

export interface UseSliderProps extends Omit<CoreSliderProps, 'id'> {
  id?: string
}

export function useSlider(props: UseSliderProps) {
  const generatedId = React.useId()
  const sliderId = props.id ?? generatedId

  const service = useMachine(sliderMachine, {
    id: sliderId,
    value: props.value,
    defaultValue: props.defaultValue,
    min: props.min ?? 0,
    max: props.max ?? 100,
    step: props.step ?? 1,
    disabled: props.disabled,
    onValueChange(details) {
      const event = createTimEvent('change', sliderId, {
        value: details.value,
      }) as never as Parameters<NonNullable<CoreSliderProps['onValueChange']>>[0]
      props.onValueChange?.(event)
    },
    onValueChangeEnd(details) {
      const event = createTimEvent('change-end', sliderId, {
        value: details.value,
      }) as never as Parameters<NonNullable<CoreSliderProps['onValueChangeEnd']>>[0]
      props.onValueChangeEnd?.(event)
    },
  })

  const api = React.useMemo(() => sliderConnect(service, normalizeProps), [service])

  return api
}
